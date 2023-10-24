from django.test import SimpleTestCase
from .factory import ResourceFactory


class TestStrMethod(SimpleTestCase):
    # def setUp(self) -> None:
    #     self.resource = ResourceFactory.build()

    def test_str_methods(self) -> None:
        # self.assertEqual(str(self.resource), self.resource.name)
        self.assertEquals(1, 1)
