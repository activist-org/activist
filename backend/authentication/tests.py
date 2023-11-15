from .factories import SupportEntityTypeFactory, SupportFactory, UserFactory, UserResourceFactory, UserTaskFactory, UserTopicFactory


def test_str_methods() -> None:
    support_entity_type = SupportEntityTypeFactory.build()
    support = SupportFactory.build()
    user = UserFactory.build()
    user_resource = UserResourceFactory.build()
    user_task = UserTaskFactory.build()
    user_topic = UserTopicFactory.build()

    assert str(support_entity_type) == support_entity_type.name
    assert str(support) == str(support.id)
    assert str(user) == user.username
    assert str(user_resource) == str(user_resource.id)
    assert str(user_task) == str(user_task.id)
    assert str(user_topic) == str(user_topic.id)
