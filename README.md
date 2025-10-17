# 🧪 FHIR Playwright Automation Framework

End-to-end automation tests for HL7 FHIR R4 APIs using Playwright Test.

---

## 📘 Table of Contents

- [About](#-about)
- [Project Structure](#-project-structure)
- [Quick Start](#️-quick-start)
- [Configuration](#-configuration)
- [Running Tests](#️-running-tests)
- [Debugging](#-debugging)
- [Quality](#-quality)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🩺 About

This repository provides a modular Playwright + TypeScript framework for automating
FHIR R4 API workflows (Patient → Encounter → MedicationRequest → Dispense → Administration)
against the public [HAPI FHIR Server](https://hapi.fhir.org/baseR4).

---

## 🧱 Project Structure

```text
src/
  builders/
  objects/
  services/
  types/
  utils/
tests/
  api/
playwright.config.ts
README.md
```

---

## ⚙️ Quick Start

```bash
npm install
npx playwright install
```

### 🧩 Configuration

Create a `.env.local` file in the project root:

```env
BASE_URL=https://hapi.fhir.org/baseR4
NODE_ENV=local
```

---

## ▶️ Running Tests

Run all tests:

```bash
npx playwright test
```

Run headed (UI visible):

```bash
npx playwright test --headed
```

View HTML report:

```bash
npx playwright show-report
```

---

## 🐞 Debugging

Verbose logs:

```bash
DEBUG=1 npx playwright test
```

Playwright API trace:

```bash
DEBUG=pw:api npx playwright test
```

---

## 🧹 Quality

Run ESLint:

```bash
npx eslint .
```

Format with Prettier:

```bash
npx prettier --write .
```

---

## 🧭 Roadmap

- [ ] Add PUT/GET/DELETE support
- [ ] Add schema validation for responses
- [ ] CI integration with GitHub Actions

---

## 👨‍💻 Author

**Jagannathan Naganathan**  
Senior SDET / Automation Engineer  
[GitHub Profile](https://github.com/jaganatwork)

---

## 🏁 License

MIT License © 2025 Jagannathan Naganathan
