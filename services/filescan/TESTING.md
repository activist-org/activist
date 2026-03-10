# Filescan Service – Test Files and Scenarios

This document describes **safe test files and scenarios** you can use to exercise the `filescan` service without using real malware.

---

## 1. Simple benign file

Use this to verify that uploads work and the happy path returns a hello message.

**File:** `benign_test.txt`
**Contents:**

```text
This is a benign test file for the filescan service.
It should be treated as clean.
```

**Example request:**

```bash
curl -X POST \
  -F "file=@/full/path/to/benign_test.txt" \
  http://localhost:9101/scan
```

**Expected response (current behavior):**

```json
{"message": "Hello, benign_test.txt"}
```

---

## 2. EICAR-style test file (pseudo-malware, safe)

The EICAR test string is an industry-standard, safe "looks like malware" pattern that AV products detect. You can use it as a marker that future scanning logic treats as "malicious".

**File:** `eicar_test.txt`
**Contents (exact line):**

```text
X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-TEST-FILE!$H+H*
```

> Note: This is safe, but some local antivirus tools may still quarantine it, because they are designed to respond to this string.

**Example request:**

```bash
curl -X POST \
  -F "file=@/full/path/to/eicar_test.txt" \
  http://localhost:9101/scan
```

**Suggested future behavior:**

- If file content contains the EICAR string → treat as **malicious**.
- Otherwise → treat as **clean**.

---

## 3. Custom "malware" signature for development

To avoid triggering local AV with EICAR entirely, use your own fake signature string that only your app understands.

**File:** `custom_malware_test.txt`
**Contents:**

```text
THIS_IS_NOT_REAL_MALWARE_BUT_TREATED_AS_MALICIOUS_BY_FILESCAN
```

**Suggested future behavior:**

- If the uploaded file contains this string, respond as if malware was detected (for example, special JSON response, log a security event, etc.).

**Example request:**

```bash
curl -X POST \
  -F "file=@/full/path/to/custom_malware_test.txt" \
  http://localhost:9101/scan
```

---

## 4. Image file test

To exercise binary/image handling, use any small image file.

**File:** for example `test_image_01.jpg`
**Contents:** any normal JPEG (photo, icon, etc.).

**Example request:**

```bash
curl -X POST \
  -F "file=@/Users/imac/Desktop/actTemp/testImages/testImage_01.jpg" \
  http://localhost:9101/scan
```

**Expected response (current behavior):**

```json
{"message": "Hello, testImage_01.jpg"}
```

---

## 5. "No file" / error-path tests

To test error handling when no file is sent:

**Case A – no body at all:**

```bash
curl -X POST http://localhost:9101/scan
```

**Case B – empty file field:**

```bash
curl -X POST \
  -F "file=" \
  http://localhost:9101/scan
```

**Expected response (current implementation):**

```json
{"detail": "No file was sent. Please include a file in the request."}
```
