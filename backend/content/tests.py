from .factory import ResourceFactory, TaskFactory, TopicFactory, ResourceTopicFactory


def test_str_methods() -> None:
    resource = ResourceFactory.build()
    task = TaskFactory.build()
    topics = TopicFactory.build()
    resource_topics = ResourceTopicFactory.build()
    assert str(resource) == resource.name
    assert str(task) == task.name
    assert str(topics) == topics.name
    assert str(resource_topics) == resource_topics.id
