import factory


class StatusTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "communities.StatusType"
        django_get_or_create = ("name",)

    name = "Active"
