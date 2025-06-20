# Guide to Adding Translations to Components

This guide explains how to add translations to new or existing components in the Virtual Arena application.

## Basic Steps

1. **Import the useTranslations hook**:
```jsx
import { useTranslations } from 'next-intl';
```

2. **Initialize the hook with the appropriate namespace**:
```jsx
// For general translations
const t = useTranslations();

// For specific namespace
const t = useTranslations('namespace'); // e.g., 'home', 'about', etc.
```

3. **Replace hardcoded text with translation keys**:
```jsx
// Before
<h1>Welcome to Virtual Arena</h1>

// After
<h1>{t('home.welcome')}</h1>
```

## Example: Converting a Component

### Before:
```jsx
const ExampleComponent = () => {
  return (
    <div>
      <h1>Our Services</h1>
      <p>Explore our range of virtual reality experiences.</p>
      <button>Learn More</button>
    </div>
  );
};
```

### After:
```jsx
import { useTranslations } from 'next-intl';

const ExampleComponent = () => {
  const t = useTranslations('services');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('learnMore')}</button>
    </div>
  );
};
```

## Adding New Translation Keys

1. **Add the key to both language files**:

In `src/messages/en.json`:
```json
{
  "services": {
    "title": "Our Services",
    "description": "Explore our range of virtual reality experiences.",
    "learnMore": "Learn More"
  }
}
```

In `src/messages/fr.json`:
```json
{
  "services": {
    "title": "Nos Services",
    "description": "Explorez notre gamme d'expériences de réalité virtuelle.",
    "learnMore": "En savoir plus"
  }
}
```

## Working with Dynamic Content

For dynamic content, you can use placeholders:

1. **In translation files**:
```json
{
  "welcome": "Welcome, {name}!"
}
```

2. **In your component**:
```jsx
<p>{t('welcome', { name: userName })}</p>
```

## Best Practices

1. **Organize by namespace**: Group related translations under a common namespace
2. **Be consistent**: Use the same key structure across the application
3. **Add both languages**: Always add translations for all supported languages
4. **Use descriptive keys**: Make keys descriptive of the content they represent
5. **Keep translations close to usage**: Organize translations to match component structure

## Finding Missing Translations

Use the provided script to find missing translations:

```bash
node scripts/find-missing-translations.js
```

This will show:
- Keys missing in either language
- Potential hardcoded text in components

## Testing Translations

Always test your components in all supported languages to ensure:
1. All text is properly translated
2. Layout works with different text lengths
3. Special characters display correctly
4. Dynamic content works as expected

## Common Issues and Solutions

1. **Missing translation key**:
   - Error: `[next-intl] Missing message: "namespace.key"`
   - Solution: Add the missing key to all language files

2. **Namespace not initialized**:
   - Error: `Cannot read properties of undefined (reading 'key')`
   - Solution: Ensure you've initialized the hook with the correct namespace

3. **Layout issues with longer text**:
   - Some languages may have longer text that breaks layouts
   - Solution: Design with flexibility for text expansion 