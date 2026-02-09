import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from content.models import Topic
from communities.organizations.models import Organization

# Create topics if they don't exist
topic_names = ['climate', 'education', 'health', 'human_rights', 
               'environment', 'social_justice', 'animal_rights', 'economic_justice']

print("Creating topics...")
topics = []
for name in topic_names:
    topic, created = Topic.objects.get_or_create(name=name)
    topics.append(topic)
    status = "✓ Created" if created else "  Already exists"
    print(f"{status}: {name}")

# Assign topics to organizations
print("\nAssigning topics to organizations...")
orgs = Organization.objects.all()

if not orgs.exists():
    print("No organizations found!")
else:
    import random
    for org in orgs:
        # Assign 1-3 random topics to each org
        num_topics = random.randint(1, 3)
        selected_topics = random.sample(topics, num_topics)
        org.topics.set(selected_topics)
        
        topic_list = ', '.join([t.name for t in selected_topics])
        print(f"✓ {org.name}: {topic_list}")
    
    print(f"\n✓ Done! Assigned topics to {orgs.count()} organizations")