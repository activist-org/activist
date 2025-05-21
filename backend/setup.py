from setuptools import find_packages, setup

setup(
    name="activist-backend",
    version="0.1.0",
    packages=find_packages(
        include=[
            "authentication",
            "communities",
            "content",
            "core",
            "events",
            "fixtures",
            "utils",
        ]
    ),
)
