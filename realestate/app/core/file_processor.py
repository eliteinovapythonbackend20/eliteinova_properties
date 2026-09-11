import io
import os
import subprocess
import tempfile
from typing import Optional, Dict, Any, Tuple
from PIL import Image
from fastapi import UploadFile
import asyncio
from concurrent.futures import ThreadPoolExecutor

class FileProcessor:
    """Handle file compression for images, videos, and PDFs"""
    
    _executor = ThreadPoolExecutor(max_workers=4)
    
    @staticmethod
    async def compress_image(
        file: UploadFile,
        quality: int = 85,
        format: str = 'WEBP'
    ) -> Tuple[io.BytesIO, Dict[str, Any]]:
        """
        Compress image by converting to WebP with quality adjustment.
        """
        content = await file.read()
        original_size_kb = len(content) // 1024
        
        try:
            image = Image.open(io.BytesIO(content))
            original_width, original_height = image.size
            
            # Handle transparency
            if image.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            elif image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Save as WebP
            output = io.BytesIO()
            image.save(output, format=format, quality=quality, optimize=True)
            compressed_content = output.getvalue()
            compressed_size_kb = len(compressed_content) // 1024
            
            compression_ratio = (
                (original_size_kb - compressed_size_kb) / original_size_kb * 100
                if original_size_kb > 0 else 0
            )
            
            compressed_file = io.BytesIO(compressed_content)
            compressed_file.filename = f"{file.filename.rsplit('.', 1)[0]}.webp"
            compressed_file.content_type = "image/webp"
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': compressed_size_kb,
                'compression_ratio': round(compression_ratio, 2),
                'width': original_width,
                'height': original_height,
                'format': 'WEBP',
                'quality': quality
            }
            
            return compressed_file, metadata
            
        except Exception as e:
            # Return original on failure
            compressed_file = io.BytesIO(content)
            compressed_file.filename = file.filename
            compressed_file.content_type = file.content_type
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': original_size_kb,
                'compression_ratio': 0,
                'width': 0,
                'height': 0,
                'format': file.filename.split('.')[-1].lower(),
                'quality': 0,
                'error': str(e)
            }
            
            return compressed_file, metadata
    
    @staticmethod
    async def compress_video(
        file: UploadFile,
        target_height: int = 720,
        bitrate: str = '1M',
        codec: str = 'libx264'
    ) -> Tuple[io.BytesIO, Dict[str, Any]]:
        """
        Compress video using ffmpeg.
        
        Args:
            file: UploadFile object
            target_height: Target height in pixels (width scales proportionally)
            bitrate: Video bitrate (e.g., '1M', '500k')
            codec: Video codec (libx264, libx265)
        """
        content = await file.read()
        original_size_kb = len(content) // 1024
        original_size_mb = original_size_kb / 1024
        
        # Create temp files
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_input:
            temp_input.write(content)
            temp_input_path = temp_input.name
        
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_output:
            temp_output_path = temp_output.name
        
        try:
            # Run ffmpeg in thread pool (CPU intensive)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                FileProcessor._executor,
                FileProcessor._compress_video_sync,
                temp_input_path,
                temp_output_path,
                target_height,
                bitrate,
                codec
            )
            
            if not result['success']:
                raise Exception(result['error'])
            
            # Read compressed content
            with open(temp_output_path, 'rb') as f:
                compressed_content = f.read()
            
            compressed_size_kb = len(compressed_content) // 1024
            compressed_size_mb = compressed_size_kb / 1024
            
            compression_ratio = (
                (original_size_kb - compressed_size_kb) / original_size_kb * 100
                if original_size_kb > 0 else 0
            )
            
            # Create file-like object
            compressed_file = io.BytesIO(compressed_content)
            compressed_file.filename = f"{file.filename.rsplit('.', 1)[0]}.mp4"
            compressed_file.content_type = "video/mp4"
            
            metadata = {
                'original_size_kb': original_size_kb,
                'original_size_mb': round(original_size_mb, 2),
                'compressed_size_kb': compressed_size_kb,
                'compressed_size_mb': round(compressed_size_mb, 2),
                'compression_ratio': round(compression_ratio, 2),
                'target_height': target_height,
                'bitrate': bitrate,
                'codec': codec,
                'format': 'MP4',
                'duration': result.get('duration', 0),
                'resolution': result.get('resolution', '')
            }
            
            return compressed_file, metadata
            
        except Exception as e:
            print(f"Video compression failed: {str(e)}")
            # Return original
            compressed_file = io.BytesIO(content)
            compressed_file.filename = file.filename
            compressed_file.content_type = file.content_type
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': original_size_kb,
                'compression_ratio': 0,
                'format': file.filename.split('.')[-1].lower(),
                'error': str(e)
            }
            
            return compressed_file, metadata
            
        finally:
            # Cleanup temp files
            for path in [temp_input_path, temp_output_path]:
                if os.path.exists(path):
                    try:
                        os.unlink(path)
                    except:
                        pass
    
    @staticmethod
    def _compress_video_sync(
        input_path: str,
        output_path: str,
        target_height: int,
        bitrate: str,
        codec: str
    ) -> Dict[str, Any]:
        """Synchronous video compression using ffmpeg"""
        try:
            # Build ffmpeg command
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-vf', f'scale=-2:{target_height}',  # Maintain aspect ratio
                '-c:v', codec,
                '-b:v', bitrate,
                '-c:a', 'aac',
                '-b:a', '128k',
                '-preset', 'medium',
                '-movflags', '+faststart',
                '-y',  # Overwrite output
                output_path
            ]
            
            # Run ffmpeg
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes timeout
            )
            
            if result.returncode != 0:
                return {
                    'success': False,
                    'error': result.stderr
                }
            
            # Get video info
            info = FileProcessor._get_video_info(output_path)
            
            return {
                'success': True,
                'duration': info.get('duration', 0),
                'resolution': info.get('resolution', '')
            }
            
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'Compression timeout (5 minutes)'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def _get_video_info(filepath: str) -> Dict[str, Any]:
        """Get video metadata using ffprobe"""
        try:
            cmd = [
                'ffprobe',
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_streams',
                '-show_format',
                filepath
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                import json
                data = json.loads(result.stdout)
                
                # Get video stream
                video_stream = next(
                    (s for s in data.get('streams', []) if s.get('codec_type') == 'video'),
                    None
                )
                
                if video_stream:
                    return {
                        'duration': float(data.get('format', {}).get('duration', 0)),
                        'resolution': f"{video_stream.get('width', 0)}x{video_stream.get('height', 0)}"
                    }
            
            return {'duration': 0, 'resolution': ''}
            
        except:
            return {'duration': 0, 'resolution': ''}
    
    @staticmethod
    async def compress_pdf(
        file: UploadFile,
        quality: str = 'medium'  # 'high', 'medium', 'low'
    ) -> Tuple[io.BytesIO, Dict[str, Any]]:
        """
        Compress PDF by converting pages to images and recompressing.
        
        Args:
            file: UploadFile object
            quality: 'high', 'medium', or 'low'
        """
        content = await file.read()
        original_size_kb = len(content) // 1024
        filename = file.filename
        
        # Quality settings
        quality_settings = {
            'high': {'dpi': 150, 'jpeg_quality': 85},
            'medium': {'dpi': 100, 'jpeg_quality': 70},
            'low': {'dpi': 72, 'jpeg_quality': 50}
        }
        settings = quality_settings.get(quality, quality_settings['medium'])
        
        try:
            import fitz  # PyMuPDF
            
            # Open and compress
            pdf_document = fitz.open(stream=content, filetype="pdf")
            output_pdf = fitz.open()
            
            page_count = len(pdf_document)
            
            for page_num in range(page_count):
                page = pdf_document[page_num]
                
                # Convert page to image for compression
                mat = fitz.Matrix(settings['dpi']/72, settings['dpi']/72)
                pix = page.get_pixmap(matrix=mat)
                
                # Create new page with compressed content
                img_data = pix.tobytes("jpeg", settings['jpeg_quality'])
                rect = page.rect
                output_page = output_pdf.new_page(width=rect.width, height=rect.height)
                
                # Insert compressed image
                img_stream = io.BytesIO(img_data)
                output_page.insert_image(rect, stream=img_stream)
            
            # Save compressed PDF
            output_buffer = io.BytesIO()
            output_pdf.save(output_buffer, garbage=4, deflate=True, clean=True)
            compressed_content = output_buffer.getvalue()
            
            pdf_document.close()
            output_pdf.close()
            
            compressed_size_kb = len(compressed_content) // 1024
            
            compression_ratio = (
                (original_size_kb - compressed_size_kb) / original_size_kb * 100
                if original_size_kb > 0 else 0
            )
            
            compressed_file = io.BytesIO(compressed_content)
            compressed_file.filename = filename
            compressed_file.content_type = "application/pdf"
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': compressed_size_kb,
                'compression_ratio': round(compression_ratio, 2),
                'page_count': page_count,
                'quality': quality,
                'dpi': settings['dpi'],
                'jpeg_quality': settings['jpeg_quality'],
                'format': 'PDF'
            }
            
            return compressed_file, metadata
            
        except ImportError:
            print("PyMuPDF not installed. Install: pip install PyMuPDF")
            # Return original
            compressed_file = io.BytesIO(content)
            compressed_file.filename = filename
            compressed_file.content_type = "application/pdf"
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': original_size_kb,
                'compression_ratio': 0,
                'error': 'PyMuPDF not available'
            }
            return compressed_file, metadata
            
        except Exception as e:
            print(f"PDF compression failed: {str(e)}")
            compressed_file = io.BytesIO(content)
            compressed_file.filename = filename
            compressed_file.content_type = "application/pdf"
            
            metadata = {
                'original_size_kb': original_size_kb,
                'compressed_size_kb': original_size_kb,
                'compression_ratio': 0,
                'error': str(e)
            }
            return compressed_file, metadata
    
    @staticmethod
    def shutdown():
        """Clean up resources"""
        FileProcessor._executor.shutdown(wait=True)