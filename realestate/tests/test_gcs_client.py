import asyncio
import io
import os
import tempfile
import unittest
from unittest.mock import patch

from app.core.gcs_client import GCSClient


class GCSClientFallbackTests(unittest.TestCase):
    def test_upload_file_falls_back_to_local_when_gcs_credentials_are_missing(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            with patch.dict(os.environ, {"GCS_FALLBACK_DIR": tmp_dir}, clear=False):
                client = GCSClient(bucket_name="test-bucket", max_workers=1)

                self.assertTrue(client.use_local_fallback)

                result = asyncio.run(
                    client.upload_file(
                        file=io.BytesIO(b"hello world"),
                        destination_path="demo/test.txt",
                    )
                )

                self.assertTrue(result.startswith("/uploads/"))
                self.assertTrue(os.path.exists(os.path.join(tmp_dir, "demo", "test.txt")))


if __name__ == "__main__":
    unittest.main()
