# Project agent instructions

## Frontend stack

- This repository contains the Petit Caillou web application.
- Use Mantine as the required component library for application UI.
- Check Mantine for an existing component or supported composition before creating a custom UI component.
- Do not add Tailwind CSS, daisyUI, gluestack, another component library, or another styling system unless the user explicitly requests it.
- Keep `@mantine/core` styles granular: import only the global foundations and the CSS files for components that are actually used. Do not import the complete `@mantine/core/styles.css` bundle.

## React and JSX

- Use Mantine components or project-defined React components in application JSX.
- Do not render intrinsic HTML elements such as `div`, `span`, `main`, `section`, `nav`, `a`, `button`, `input`, or `p` directly in React components.
- Preserve semantics with Mantine's `component` prop, for example `<Box component="main">` or `<Box component="nav">`.
- Raw SVG elements are allowed only inside dedicated icon, illustration, or brand components.
- Do not import the default `React` namespace. Never write `import React from 'react'` or `import * as React from 'react'`.
- Import only the named React APIs and types that are required, for example `import { useState, type ReactNode } from 'react'`.

## Styling

- Prefer Mantine component defaults, component props, design tokens, and the shared theme in `src/theme.ts`.
- Put reusable visual decisions in the Mantine theme instead of repeating them in components.
- Avoid React's `style` prop and Mantine's `styles` prop. Use them only for truly dynamic values that cannot be expressed through component props, theme configuration, or a reusable class.
- Do not create custom CSS when Mantine already supports the requirement.
- Keep custom CSS limited to brand-specific artwork, exceptional layouts, and animations that Mantine cannot express cleanly.
- Prefer a CSS module scoped to the owning component when custom CSS is necessary. Do not grow the global stylesheet for component-specific rules.
- Preserve the existing Petit Caillou logo and its dedicated visual treatment unless the user explicitly requests a redesign.

## Component reuse

- Search for an existing component before creating a new one.
- When a meaningful UI pattern appears for the second time, immediately extract or refactor it into one shared component.
- Extend an existing component with typed props or variants instead of copying its markup or styling.
- Do not extract generic layout wrappers solely because `Box`, `Group`, or `Stack` appears multiple times.
- Keep components focused and give shared components clear, domain-specific names.

## Code quality

- Keep comments, documentation, identifiers, and developer-facing messages in English.
- Follow the repository ESLint rules: no semicolons, two-space indentation, consistent spacing, and Allman braces for code blocks.
- Run `npm run lint` and `npm run build` from this repository after frontend changes. The same commands are also available from the shared parent repository when it is present.
