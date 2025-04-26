# Redis Implementation

This file is meant to document the potential one day addition of [Redis](https://redis.io/) to the activist backend. At time of creation, the team decided that adding in Redis is an extra service that we don't have capacity to maintain. The plan is to add it at some point, but only after simpler performance improvements have been implemented and exhausted.

An initial change that's needed is that [django-redis](https://github.com/jazzband/django-redis) should be added to the backend dependencies by adding it to [backend/requirements.in](./requirements.in) and [backend/requirements-dev.in](./requirements-dev.in). The commands within those files are then ran to add it to the respective `.txt` files.

## File Changes

Please see [#1163](https://github.com/activist-org/activist/pull/1163) where adding [Redis](https://redis.io/) to the backend was first done. The changes in that PR would be the basis of an eventual addition of [Redis](https://redis.io/).
