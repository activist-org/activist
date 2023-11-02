from .factory import OrganizationFactory, OrganizationApplicationFactory, OrganizationApplicationStatusFactory, OrganizationEventFactory, OrganizationMemberFactory, OrganizationResourceFactory, GroupFactory, OrganizationTaskFactory, OrganizationTopicFactory, GroupEventFactory, GroupMemberFactory, GroupResourceFactory, GroupTopic
import pytest

@pytest.mark.django_db
def test_str_methods() -> None:
    organization = OrganizationFactory.build()
    organization_application = OrganizationApplicationFactory.build()
    organization_application_status = OrganizationApplicationStatusFactory.build()
    organization_event = OrganizationEventFactory.build()
    organization_member = OrganizationMemberFactory.build()
    organization_resource = OrganizationResourceFactory.build()
    organization_task = OrganizationTaskFactory.build()
    organization_topic = OrganizationTopicFactory.build()
    group = GroupFactory.build()
    group_event = GroupEventFactory.build()
    group_member = GroupMemberFactory.build()
    group_resource = GroupResourceFactory.build()
    group_topic = GroupTopic.build()
    
    assert str(organization) == organization.name
    assert str(organization_application) == str(organization_application.id)
    assert str(organization_application_status) == str(organization_application_status.id)
    assert str(organization_event) == str(organization_event.id)
    assert str(organization_member) == str(organization_member.id)
    assert str(organization_resource) == str(organization_resource.id)
    assert str(organization_task) == str(organization_task.id)
    assert str(organization_topic) == str(organization_topic.id)
    assert str(group) == group.name
    assert str(group_event) == str(group_event.id)
    assert str(group_member) == str(group_member.id)
    assert str(group_resource) == str(group_resource.id)
    assert str(group_topic) == str(group_topic.id)
    