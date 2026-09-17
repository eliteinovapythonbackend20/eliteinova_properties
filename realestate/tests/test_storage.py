import asyncio
import io
import unittest

from app.core.config import settings
from app.core.storage.local_storage import LocalStorage
from app.core.storage.cloudinary_storage import CloudinaryStorage
from app.core.storage.gcs_storage import GCSStorage
from app.core.storage_factory import StorageFactory


class LocalStorageTests(unittest.TestCase):
    def test_upload_and_delete_roundtrip(self):
        import tempfile

        with tempfile.TemporaryDirectory() as tmp_dir:
            original_path = settings.LOCAL_STORAGE_PATH
            settings.LOCAL_STORAGE_PATH = tmp_dir
            try:
                storage = LocalStorage()

                stored_path = asyncio.run(
                    storage.upload_file(
                        file=io.BytesIO(b"hello world"),
                        destination_path="demo/test.txt",
                    )
                )

                self.assertEqual(stored_path, "demo/test.txt")
                self.assertTrue(asyncio.run(storage.file_exists("demo/test.txt")))

                asyncio.run(storage.delete_file("demo/test.txt"))
                self.assertFalse(asyncio.run(storage.file_exists("demo/test.txt")))
            finally:
                settings.LOCAL_STORAGE_PATH = original_path


class StorageFactoryTests(unittest.TestCase):
    def setUp(self):
        StorageFactory.reset()

    def tearDown(self):
        StorageFactory.reset()

    def test_defaults_to_local_storage_for_unknown_type(self):
        original = settings.STORAGE_TYPE
        settings.STORAGE_TYPE = "something-unrecognized"
        try:
            self.assertIsInstance(StorageFactory.get_storage(), LocalStorage)
        finally:
            settings.STORAGE_TYPE = original

    def test_selects_cloudinary_storage(self):
        original = settings.STORAGE_TYPE
        settings.STORAGE_TYPE = "cloudinary"
        try:
            self.assertIsInstance(StorageFactory.get_storage(), CloudinaryStorage)
        finally:
            settings.STORAGE_TYPE = original

    # GCSStorage.__init__ makes a real network call (bucket.exists()), so it
    # isn't safe to instantiate in a unit test without mocking the google
    # cloud client - just confirm it implements the same interface the
    # factory expects, matching LocalStorage/CloudinaryStorage.
    def test_gcs_storage_implements_storage_provider(self):
        from app.core.storage.base import StorageProvider

        self.assertTrue(issubclass(GCSStorage, StorageProvider))


if __name__ == "__main__":
    unittest.main()
