import factory
from .models import SupportEntityType, Support, User, UserResource, UserTask, UserTopic

class SupportEntityTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SupportEntityType

    name = factory.Faker('word')

class SupportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Support

    supporter_type = factory.SubFactory(SupportEntityTypeFactory)
    supporter_entity = factory.Faker('random_int', min=1, max=100) 
    supported_type = factory.SubFactory(SupportEntityTypeFactory)
    supported_entity = factory.Faker('random_int', min=1, max=100)  

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    user_name = factory.Faker('user_name')
    name = factory.Faker('name')
    password = factory.Faker('password')
    location = factory.Faker('city')
    description = factory.Faker('text', max_nb_chars=500)
    verified = factory.Faker('boolean')
    verification_method = factory.Faker('word')
    verification_partner = factory.SubFactory("content.UserFactory")
    social_accounts = [factory.Faker('user_name') for _ in range(3)] 
    private = factory.Faker('boolean')
    high_risk = factory.Faker('boolean')
    total_flags = factory.Faker('random_int', min=0, max=100)  
    creation_date = factory.Faker('date_time_this_decade', before_now=True)
    deletion_date = factory.Faker('date_time_this_decade', before_now=False)

class UserResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserResource

    user_id = factory.SubFactory(UserFactory)
    resource_id = factory.SubFactory("content.ResourceFactory")

class UserTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserTask

    user_id = factory.SubFactory(UserFactory)
    task_id = factory.SubFactory("content.TaskFactory")

class UserTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserTopic

    user_id = factory.SubFactory(UserFactory)
    topic_id = factory.SubFactory("content.TopicFactory")
