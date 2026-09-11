# app/services/email_service.py
import aiosmtplib
from email.message import EmailMessage
from email.headerregistry import Address
from email.errors import HeaderParseError
from typing import Optional, Dict, Any
from pathlib import Path
import logging
from jinja2 import Environment, FileSystemLoader, TemplateNotFound, select_autoescape
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailServiceError(Exception):
    """Base exception for email service failures."""


class EmailConfigError(EmailServiceError):
    """Raised when the service is misconfigured (e.g. conflicting TLS/SSL flags)."""


class EmailSendError(EmailServiceError):
    """Raised when the underlying SMTP send fails. Wraps the original exception."""

    def __init__(self, message: str, original_exception: Optional[Exception] = None):
        super().__init__(message)
        self.original_exception = original_exception


# Shared base template for simple transactional "action button" emails
_ACTION_EMAIL_TEMPLATE = """
<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>{{ heading }}</h2>
        <p>Hello {{ user_name }},</p>
        <p>{{ intro_text }}</p>
        <p>
            <a href="{{ action_url }}" style="display: inline-block; padding: 10px 20px; background-color: {{ button_color }}; color: white; text-decoration: none; border-radius: 5px;">
                {{ button_text }}
            </a>
        </p>
        <p>This link will expire in {{ expire_hours }} hours.</p>
        <p>{{ footer_text }}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </body>
</html>
"""

_ACTION_EMAIL_TEXT_TEMPLATE = """{{ heading }}
Hello {{ user_name }},
{{ intro_text }}
{{ action_url }}
This link will expire in {{ expire_hours }} hours.
{{ footer_text }}
This is an automated message, please do not reply.
"""


def _sanitize_header_value(value: str) -> str:
    if value is None:
        return value
    return value.replace("\r", "").replace("\n", "").strip()


class EmailService:
    """Email service using aiosmtplib for async email sending"""

    def __init__(
        self,
        hostname: str,
        port: int,
        username: str,
        password: str,
        from_email: str,
        from_name: Optional[str] = None,
        use_tls: bool = True,
        use_ssl: bool = False,
        timeout: int = 30,
        template_dir: Optional[Path] = None,
    ):
        current_port = int(port)
        
        # Port 465 ONLY uses implicit TLS. Port 587 ONLY uses explicit STARTTLS.
        is_implicit_tls = (current_port == 465)
        self.requires_starttls = (current_port == 587)

        # Build clean configuration strictly following aiosmtplib naming
        self.smtp_config = {
            "hostname": hostname,
            "port": current_port,
            "username": username,
            "password": password.strip(),  # Removes accidental trailing whitespaces
            "use_tls": is_implicit_tls,    # True only for 465
            "timeout": timeout,
        }

        self.from_email = from_email
        self.from_name = from_name or from_email

        self.template_dir = template_dir or (
            Path(__file__).parent.parent / "templates" / "email"
        )
        self._jinja_env = Environment(
            loader=FileSystemLoader(str(self.template_dir))
            if self.template_dir.exists()
            else None,
            autoescape=select_autoescape(["html", "htm", "xml"]),
        )

    async def send_email(
        self,
        to_email: str | list[str],
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None,
        cc: Optional[list[str]] = None,
        bcc: Optional[list[str]] = None,
        attachments: Optional[list[Dict[str, Any]]] = None,
        reply_to: Optional[str] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> bool:
        print(f"Email connection sequence initiated...")
        smtp = None
        try:
            # Build your message envelope payload
            message = EmailMessage()
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = ", ".join([to_email] if isinstance(to_email, str) else to_email)
            message["Subject"] = _sanitize_header_value(subject)
            if cc: message["Cc"] = ", ".join(cc)
            if bcc: message["Bcc"] = ", ".join(bcc)
            if reply_to: message["Reply-To"] = reply_to
            if headers:
                for key, value in headers.items():
                    message[key] = _sanitize_header_value(str(value))

            if html_content and text_content:
                message.set_content(text_content)
                message.add_alternative(html_content, subtype="html")
            elif html_content:
                message.set_content(html_content, subtype="html")
            elif text_content:
                message.set_content(text_content)
            else:
                raise ValueError("Either html_content or text_content must be provided")

            if attachments:
                for attachment in attachments:
                    if "content" in attachment and "filename" in attachment:
                        mime_type = attachment.get("mime_type", "application/octet-stream")
                        main_type, sub_type = mime_type.split("/", 1)
                        message.add_attachment(
                            attachment["content"],
                            maintype=main_type,
                            subtype=sub_type,
                            filename=attachment["filename"],
                        )

            # 🛠️ THE CRITICAL CHANGE: Initialize exactly matching the checked configuration dict
            smtp = aiosmtplib.SMTP(
                hostname=self.smtp_config["hostname"],
                port=self.smtp_config["port"],
                use_tls=self.smtp_config["use_tls"],  # Ensures Port 465 initiates TLS wrapper on startup
                timeout=self.smtp_config["timeout"]
            )
            
            # Connect to stream
            await smtp.connect()
            print(f"SMTP connection established.")
            
            # Upgrade dynamically if on port 587
            if self.requires_starttls:
                await smtp.starttls()
                print("STARTTLS encryption layer applied successfully.")
            
            # Authenticate credentials safely under the established TLS tunnel
            if self.smtp_config["username"] and self.smtp_config["password"]:
                await smtp.login(
                    self.smtp_config["username"],
                    self.smtp_config["password"]
                )
                print("SMTP login verified.")
            
            # Fire email transmission
            await smtp.send_message(message)
            print(f"Email sent successfully to {to_email}")

            logger.info("Email sent successfully to %s", to_email)
            return True

        except Exception as e:
            logger.error("Unexpected error sending email: %s", e, exc_info=True)
            print(f"Error encountered: {str(e)}")
            return False

        finally:
            if smtp:
                try:
                    await smtp.quit()
                    print("SMTP connection terminated cleanly.")
                except Exception as e:
                    logger.warning("Error while closing SMTP connection: %s", e)




    async def send_template_email(
        self,
        to_email: str | list[str],
        subject: str,
        template_name: str,
        template_data: Dict[str, Any],
        **kwargs,
    ) -> bool:
        """Send email using a named Jinja2 template (see _render_template)."""
        html_content = self._render_template(template_name, template_data)
        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            **kwargs,
        )

    def _render_template(self, template_name: str, data: Dict[str, Any]) -> str:
        if self._jinja_env.loader is not None:
            try:
                template = self._jinja_env.get_template(f"{template_name}.html")
                return template.render(**data)
            except TemplateNotFound:
                logger.warning(
                    "Email template '%s' not found in %s, using fallback",
                    template_name,
                    self.template_dir,
                )

        fallback = self._jinja_env.from_string(
            """
            <html>
                <body>
                    <h2>{{ title }}</h2>
                    <p>{{ message }}</p>
                    <p>For more information, please visit our website.</p>
                </body>
            </html>
            """
        )
        return fallback.render(
            title=data.get("title", "Notification"),
            message=data.get("message", ""),
        )

    async def _send_action_email(
        self,
        email: str,
        user_name: str,
        subject: str,
        heading: str,
        intro_text: str,
        action_url: str,
        button_text: str,
        button_color: str,
        expire_hours: int,
        footer_text: str,
    ) -> bool:
        context = {
            "heading": heading,
            "user_name": user_name,
            "intro_text": intro_text,
            "action_url": action_url,
            "button_text": button_text,
            "button_color": button_color,
            "expire_hours": expire_hours,
            "footer_text": footer_text,
        }

        html_content = self._jinja_env.from_string(_ACTION_EMAIL_TEMPLATE).render(**context)
        text_content = self._jinja_env.from_string(_ACTION_EMAIL_TEXT_TEMPLATE).render(**context)
        print(f"i am going to call the email")
        return await self.send_email(
            to_email=email,
            subject=subject,
            html_content=html_content,
            text_content=text_content,
        )

    async def send_password_reset_email(
        self,
        email: str,
        reset_token: str,
        user_name: str,
    ) -> bool:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        print(f"reset link token: {reset_link}")
        print(f"SMTP_HOST: {settings.SMTP_HOST}")
        print(f"SMTP_PORT: {settings.SMTP_PORT}")
        print(f"SMTP_USERNAME: {settings.SMTP_USERNAME}")
        print(f"SMTP_USE_TLS: {settings.SMTP_USE_TLS}")
        print(f"SMTP_USE_SSL: {settings.SMTP_USE_SSL}")
        print(f"SMTP_FROM_EMAIL: {settings.SMTP_FROM_EMAIL}")
        return await self._send_action_email(
            email=email,
            user_name=user_name,
            subject="Password Reset Request",
            heading="Password Reset Request",
            intro_text="We received a request to reset your password. Click the link below to reset it:",
            action_url=reset_link,
            button_text="Reset Password",
            button_color="#007bff",
            expire_hours=settings.RESET_TOKEN_EXPIRE_HOURS,
            footer_text="If you didn't request this, please ignore this email.",
        )

    async def send_verification_email(
        self,
        email: str,
        verification_token: str,
        user_name: str,
    ) -> bool:
        """Send email verification email"""
        verify_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"

        return await self._send_action_email(
            email=email,
            user_name=user_name,
            subject="Verify Your Email Address",
            heading="Verify Your Email",
            intro_text="Please click the link below to verify your email address:",
            action_url=verify_link,
            button_text="Verify Email",
            button_color="#28a745",
            expire_hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS,
            footer_text="If you didn't create an account, please ignore this email.",
        )


# Dependency for FastAPI
async def get_email_service() -> EmailService:
    """Dependency injection for email service"""
    return EmailService(
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        from_email=settings.SMTP_FROM_EMAIL,
        from_name=settings.SMTP_FROM_NAME,
        use_tls=settings.SMTP_USE_TLS,
        use_ssl=settings.SMTP_USE_SSL,
        timeout=settings.SMTP_TIMEOUT,
    )





















































# # app/services/email_service.py
# import aiosmtplib
# from email.message import EmailMessage
# from email.headerregistry import Address
# from email.errors import HeaderParseError
# from typing import Optional, Dict, Any
# from pathlib import Path
# import logging
# from jinja2 import Environment, FileSystemLoader, TemplateNotFound, select_autoescape
# from app.core.config import settings

# logger = logging.getLogger(__name__)


# class EmailServiceError(Exception):
#     """Base exception for email service failures."""


# class EmailConfigError(EmailServiceError):
#     """Raised when the service is misconfigured (e.g. conflicting TLS/SSL flags)."""


# class EmailSendError(EmailServiceError):
#     """Raised when the underlying SMTP send fails. Wraps the original exception."""

#     def __init__(self, message: str, original_exception: Optional[Exception] = None):
#         super().__init__(message)
#         self.original_exception = original_exception


# # Shared base template for simple transactional "action button" emails
# # (password reset, email verification, etc). Autoescaped by Jinja2, so any
# # interpolated values (name, links) are HTML-escaped automatically.
# _ACTION_EMAIL_TEMPLATE = """
# <html>
#     <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
#         <h2>{{ heading }}</h2>
#         <p>Hello {{ user_name }},</p>
#         <p>{{ intro_text }}</p>
#         <p>
#             <a href="{{ action_url }}" style="display: inline-block; padding: 10px 20px; background-color: {{ button_color }}; color: white; text-decoration: none; border-radius: 5px;">
#                 {{ button_text }}
#             </a>
#         </p>
#         <p>This link will expire in {{ expire_hours }} hours.</p>
#         <p>{{ footer_text }}</p>
#         <hr>
#         <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
#     </body>
# </html>
# """

# _ACTION_EMAIL_TEXT_TEMPLATE = """{{ heading }}
# Hello {{ user_name }},
# {{ intro_text }}
# {{ action_url }}
# This link will expire in {{ expire_hours }} hours.
# {{ footer_text }}
# This is an automated message, please do not reply.
# """


# def _sanitize_header_value(value: str) -> str:
#     if value is None:
#         return value
#     return value.replace("\r", "").replace("\n", "").strip()


# class EmailService:
#     """Email service using aiosmtplib for async email sending"""

#     def __init__(
#         self,
#         hostname: str,
#         port: int,
#         username: str,
#         password: str,
#         from_email: str,
#         from_name: Optional[str] = None,
#         use_tls: bool = True,  # Often passed as True from .env files
#         use_ssl: bool = False,
#         timeout: int = 30,
#         template_dir: Optional[Path] = None,
#     ):
#         # Determine if it's implicit TLS based directly on the port number
#         is_port_465 = int(port) == 465

#         # Save configuration matching exactly how aiosmtplib expects it
#         self.smtp_config = {
#             "hostname": hostname,
#             "port": int(port),
#             "username": username,
#             "password": password.strip(),  # Automatically strips accidental hidden spaces
#             "use_tls": is_port_465,        # Crucial fix: True ONLY for 465
#             "timeout": timeout,
#         }

#         # Keep a secondary boolean flag specifically to track if STARTTLS is needed for Port 587
#         self.tls_upgrade_required = (int(port) == 587) and (use_tls or use_ssl)

#         self.from_email = from_email
#         self.from_name = from_name or from_email

#         self.template_dir = template_dir or (
#             Path(__file__).parent.parent / "templates" / "email"
#         )
#         self._jinja_env = Environment(
#             loader=FileSystemLoader(str(self.template_dir))
#             if self.template_dir.exists()
#             else None,
#             autoescape=select_autoescape(["html", "htm", "xml"]),
#         )


#     async def send_email(
#         self,
#         to_email: str | list[str],
#         subject: str,
#         html_content: Optional[str] = None,
#         text_content: Optional[str] = None,
#         cc: Optional[list[str]] = None,
#         bcc: Optional[list[str]] = None,
#         attachments: Optional[list[Dict[str, Any]]] = None,
#         reply_to: Optional[str] = None,
#         headers: Optional[Dict[str, str]] = None,
#     ) -> bool:
#         print(f"email is on the way")
#         try:
#             message = EmailMessage()

#             message["From"] = f"{self.from_name} <{self.from_email}>"
#             message["To"] = ", ".join([to_email] if isinstance(to_email, str) else to_email)
#             message["Subject"] = _sanitize_header_value(subject)

#             if cc:
#                 message["Cc"] = ", ".join(cc)
#             if bcc:
#                 message["Bcc"] = ", ".join(bcc)
#             if reply_to:
#                 message["Reply-To"] = reply_to
#             if headers:
#                 for key, value in headers.items():
#                     message[key] = _sanitize_header_value(str(value))

#             if html_content and text_content:
#                 message.set_content(text_content)
#                 message.add_alternative(html_content, subtype="html")
#             elif html_content:
#                 message.set_content(html_content, subtype="html")
#             elif text_content:
#                 message.set_content(text_content)
#             else:
#                 raise ValueError("Either html_content or text_content must be provided")

#             if attachments:
#                 for attachment in attachments:
#                     if "content" in attachment and "filename" in attachment:
#                         mime_type = attachment.get("mime_type", "application/octet-stream")
#                         main_type, sub_type = mime_type.split("/", 1)
#                         message.add_attachment(
#                             attachment["content"],
#                             maintype=main_type,
#                             subtype=sub_type,
#                             filename=attachment["filename"],
#                         )

#             await aiosmtplib.send(message, **self.smtp_config)

#             logger.info("Email sent successfully to %s with subject: %s", to_email, subject)
#             return True

#         except (ValueError, HeaderParseError) as e:
#             # Caller-fixable problems: bad input, not a transient SMTP failure.
#             logger.error("Invalid email input for %s: %s", to_email, e, exc_info=True)
#             return False

#         except aiosmtplib.SMTPException as e:
#             # SMTP-level failures (auth, connection, recipient refused, etc).
#             # exc_info=True preserves the traceback so these are actually
#             # debuggable instead of collapsing into a one-line string.
#             logger.error(
#                 "SMTP error sending to %s (%s): %s",
#                 to_email,
#                 type(e).__name__,
#                 e,
#                 exc_info=True,
#             )
#             return False

#         except Exception as e:
#             logger.error("Unexpected error sending email to %s: %s", to_email, e, exc_info=True)
#             return False

#     async def send_template_email(
#         self,
#         to_email: str | list[str],
#         subject: str,
#         template_name: str,
#         template_data: Dict[str, Any],
#         **kwargs,
#     ) -> bool:
#         """Send email using a named Jinja2 template (see _render_template)."""
#         html_content = self._render_template(template_name, template_data)
#         return await self.send_email(
#             to_email=to_email,
#             subject=subject,
#             html_content=html_content,
#             **kwargs,
#         )

#     def _render_template(self, template_name: str, data: Dict[str, Any]) -> str:
#         if self._jinja_env.loader is not None:
#             try:
#                 template = self._jinja_env.get_template(f"{template_name}.html")
#                 return template.render(**data)
#             except TemplateNotFound:
#                 logger.warning(
#                     "Email template '%s' not found in %s, using fallback",
#                     template_name,
#                     self.template_dir,
#                 )

#         fallback = self._jinja_env.from_string(
#             """
#             <html>
#                 <body>
#                     <h2>{{ title }}</h2>
#                     <p>{{ message }}</p>
#                     <p>For more information, please visit our website.</p>
#                 </body>
#             </html>
#             """
#         )
#         return fallback.render(
#             title=data.get("title", "Notification"),
#             message=data.get("message", ""),
#         )

#     async def _send_action_email(
#         self,
#         email: str,
#         user_name: str,
#         subject: str,
#         heading: str,
#         intro_text: str,
#         action_url: str,
#         button_text: str,
#         button_color: str,
#         expire_hours: int,
#         footer_text: str,
#     ) -> bool:
#         context = {
#             "heading": heading,
#             "user_name": user_name,
#             "intro_text": intro_text,
#             "action_url": action_url,
#             "button_text": button_text,
#             "button_color": button_color,
#             "expire_hours": expire_hours,
#             "footer_text": footer_text,
#         }

#         html_content = self._jinja_env.from_string(_ACTION_EMAIL_TEMPLATE).render(**context)
#         text_content = self._jinja_env.from_string(_ACTION_EMAIL_TEXT_TEMPLATE).render(**context)
#         print(f"i am going to call the email")
#         return await self.send_email(
#             to_email=email,
#             subject=subject,
#             html_content=html_content,
#             text_content=text_content,
#         )

#     async def send_password_reset_email(
#         self,
#         email: str,
#         reset_token: str,
#         user_name: str,
#     ) -> bool:
#         reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
#         print(f"reset link token: {reset_link}")
#         print(f"SMTP_HOST: {settings.SMTP_HOST}")
#         print(f"SMTP_PORT: {settings.SMTP_PORT}")
#         print(f"SMTP_USERNAME: {settings.SMTP_USERNAME}")
#         print(f"SMTP_USE_TLS: {settings.SMTP_USE_TLS}")
#         print(f"SMTP_USE_SSL: {settings.SMTP_USE_SSL}")
#         print(f"SMTP_FROM_EMAIL: {settings.SMTP_FROM_EMAIL}")
#         return await self._send_action_email(
#             email=email,
#             user_name=user_name,
#             subject="Password Reset Request",
#             heading="Password Reset Request",
#             intro_text="We received a request to reset your password. Click the link below to reset it:",
#             action_url=reset_link,
#             button_text="Reset Password",
#             button_color="#007bff",
#             expire_hours=settings.RESET_TOKEN_EXPIRE_HOURS,
#             footer_text="If you didn't request this, please ignore this email.",
#         )

#     async def send_verification_email(
#         self,
#         email: str,
#         verification_token: str,
#         user_name: str,
#     ) -> bool:
#         """Send email verification email"""
#         verify_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"

#         return await self._send_action_email(
#             email=email,
#             user_name=user_name,
#             subject="Verify Your Email Address",
#             heading="Verify Your Email",
#             intro_text="Please click the link below to verify your email address:",
#             action_url=verify_link,
#             button_text="Verify Email",
#             button_color="#28a745",
#             expire_hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS,
#             footer_text="If you didn't create an account, please ignore this email.",
#         )


# # Dependency for FastAPI
# async def get_email_service() -> EmailService:
#     """Dependency injection for email service"""
#     return EmailService(
#         hostname=settings.SMTP_HOST,
#         port=settings.SMTP_PORT,
#         username=settings.SMTP_USERNAME,
#         password=settings.SMTP_PASSWORD,
#         from_email=settings.SMTP_FROM_EMAIL,
#         from_name=settings.SMTP_FROM_NAME,
#         use_tls=settings.SMTP_USE_TLS,
#         use_ssl=settings.SMTP_USE_SSL,
#         timeout=settings.SMTP_TIMEOUT,
#     )