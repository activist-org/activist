# Backend Testing

This documentation details standards for writing pytest based backend testing files.

<a id="contents"></a>

## **Contents**

- [Standards](#standatds-)

<a id="standards-"></a>

## Standards [`⇧`](#contents)

- All tests for backend applications should be in a `tests` sub directory
- Testing files should be named `test_ENTITY_{MODEL_SUB_CLASS}_CRUD_METHOD`, with the `MODEL_SUB_CLASS` being optional
  - Model sub classes are "bridge table" methods that are serialized into the base model
    - Ex: `flag` as a sub class of `event`
  - Model sub classes should always be singular in the base model, and should thus be singular in the test file name
  - The tests for the specific entity, model sub class and CRUD method should all be included in this file
  - Ex: `test_event_delete` (there is no `MODEL_SUB_CLASS`)
  - Ex: `test_event_flag_delete` (there is an `MODEL_SUB_CLASS`)
- If there is more than one file being used for testing entity methods, then these files should be put into a sub directory
  - Base CRUD method tests for an entity would be in the root testing directory
  - All tests for a certain model sub class  should be in a sub directory, even if there's only one file
  - Ex: Organization flag method tests should be in the `communities/organizations/tests/flag` directory
  - Ex: All CRUD method tests on organizations directly should be in the  `communities/organizations/tests` directory
- Test function names should start with the name of the file
- If there is only one API endpoint used in a testing file, it should be defined as a `SCREAMING_SNAKE_CASE` variable at the top of the file
