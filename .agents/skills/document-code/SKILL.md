---
name: document-code
description: Add comprehensive documentation to code files for new developers. Adds file headers explaining purpose and inline comments explaining how each code section works. Use when user says "document this code", "add comments", "explain this file", "help new developers understand", or "add documentation".
user-invocable: true
argument-hint: "[file or directory]"
---

Analyze code files and add clear, helpful documentation for developers new to the codebase.

## Process

### 1. Identify Target Files

If the user specifies a file or directory, focus on those. If no target is specified:
- Ask the user which files need documentation
- Or suggest files that appear complex or lack comments

### 2. Analyze Each File

For each file, understand:
- **Purpose**: What problem does this file solve?
- **Dependencies**: What does it import and why?
- **Exports**: What does it expose to other files?
- **Key logic**: What are the main algorithms or patterns?
- **Side effects**: Any mutations, API calls, or global state changes?

### 3. Add File Header

Add a JSDoc-style comment block at the top of the file:

```typescript
/**
 * @fileoverview Brief one-line description of the file's purpose
 *
 * This file provides [main functionality]. It handles:
 * - [responsibility 1]
 * - [responsibility 2]
 * - [responsibility 3]
 *
 * @module [module name if applicable]
 * @see [related files or documentation]
 * @example
 * // Basic usage example if applicable
 * import { something } from '@/path/to/file'
 * something()
 */
```

For non-TypeScript/JavaScript files, adapt the style appropriately:
- Python: Docstring at module level
- CSS: Comment block at top
- Config files: Inline comments

### 4. Add Inline Documentation

Document each significant code section:

#### Functions/Methods
```typescript
/**
 * Brief description of what the function does
 *
 * @description More detailed explanation if needed
 * @param {Type} paramName - What this parameter represents
 * @returns {Type} What the function returns
 * @throws {ErrorType} When this error occurs
 *
 * @example
 * functionName(arg1, arg2) // returns expected result
 */
```

#### Complex Logic
Add comments explaining:
- **Why** a decision was made (not just what)
- **How** an algorithm works step-by-step
- **Trade-offs** and alternatives considered
- **Gotchas** and edge cases

```typescript
// Use 60fps timing for smooth animations
// This value was chosen because... (explain reasoning)
const ANIMATION_DURATION = 100 // milliseconds

// Split array into chunks for batch processing
// This prevents memory issues with large datasets
const chunks = array.reduce((acc, item, i) => {
  // ... logic with inline explanation
}, [] as T[][])
```

#### React Components
```tsx
/**
 * ComponentName - Brief description
 *
 * Renders [what it renders]. Handles [user interactions/state].
 *
 * @component
 * @example
 * <ComponentName prop1="value" />
 *
 * @remarks
 * - Note about accessibility considerations
 * - Performance considerations
 */
```

#### Custom Hooks
```typescript
/**
 * useHookName - Brief description of hook purpose
 *
 * Manages [state/effect/behavior]. Returns [what it returns].
 *
 * @param config - Configuration options
 * @returns An object containing:
 *   - `value`: Description of value
 *   - `setValue`: Function to update value
 *
 * @example
 * const { value, setValue } = useHookName({ option: true })
 */
```

#### Type Definitions
```typescript
/**
 * Configuration options for the animation system
 */
interface AnimationConfig {
  /** Duration in milliseconds (default: 300) */
  duration: number

  /** Easing function name or custom bezier curve */
  easing: 'ease-in' | 'ease-out' | [number, number, number, number]

  /** Whether to respect user's reduced motion preference */
  respectReducedMotion?: boolean
}
```

### 5. Documentation Quality Rules

**DO:**
- Explain business logic and domain concepts
- Document non-obvious decisions and trade-offs
- Include usage examples for public APIs
- Explain the "why" behind complex logic
- Document edge cases and error conditions
- Keep comments up-to-date when code changes

**DON'T:**
- State the obvious (`// sets the name` for `setName()`)
- Repeat the function name in the description
- Add comments that could become outdated easily
- Over-document simple getter/setter functions
- Leave outdated comments after refactoring
- Use jargon without explanation

### 6. Comment Density Guidelines

- **High value**: Complex algorithms, business rules, performance optimizations
- **Medium value**: Component props, function parameters, type definitions
- **Low value**: Simple variable declarations, obvious assignments
- **Skip**: Self-explanatory code, standard patterns

### 7. Output Format

After documenting, provide a summary:
- Files modified
- Key documentation added
- Any areas that need clarification from the user
- Suggestions for additional documentation (README, etc.)

## Example Transformation

### Before
```typescript
export function useAnimation(config) {
  const [state, setState] = useState({ playing: false, progress: 0 })
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!config.autoPlay) return
    const el = ref.current
    const animation = el?.animate(keyframes, config.options)
    animation?.play()
    return () => animation?.cancel()
  }, [config])

  return { ref, ...state }
}
```

### After
```typescript
/**
 * @fileoverview Custom hook for managing element animations
 *
 * Provides a declarative API for animating DOM elements with
 * automatic cleanup and state tracking.
 */

/**
 * useAnimation - Hook for controlling element animations
 *
 * Manages Web Animations API with React lifecycle. Automatically
 * handles cleanup on unmount and provides real-time progress tracking.
 *
 * @param config - Animation configuration
 * @param config.autoPlay - Start animation immediately on mount
 * @param config.options - Web Animations API options (duration, easing, etc.)
 * @param config.keyframes - Array of keyframe objects
 *
 * @returns Animation state and controls
 * @returns {ref} - Ref to attach to target element
 * @returns {playing} - Whether animation is currently running
 * @returns {progress} - Current progress (0-1)
 *
 * @example
 * const { ref, playing } = useAnimation({
 *   autoPlay: true,
 *   keyframes: [{ opacity: 0 }, { opacity: 1 }],
 *   options: { duration: 300 }
 * })
 *
 * return <div ref={ref}>Animated content</div>
 */
export function useAnimation(config: AnimationConfig) {
  // Track animation state for consumer components
  const [state, setState] = useState({ playing: false, progress: 0 })

  // Reference to the DOM element being animated
  const ref = useRef<HTMLElement>(null)

  // Set up animation when config changes
  // Cleanup prevents memory leaks and stale animations
  useEffect(() => {
    // Skip if autoPlay is disabled - consumer will trigger manually
    if (!config.autoPlay) return

    const el = ref.current

    // Create Web Animation instance
    const animation = el?.animate(keyframes, config.options)
    animation?.play()

    // Cleanup: cancel animation on unmount or config change
    return () => animation?.cancel()
  }, [config])

  return { ref, ...state }
}
```

## Verification

After adding documentation, verify:
- [ ] File headers clearly state purpose
- [ ] Public APIs have usage examples
- [ ] Complex logic has "why" explanations
- [ ] Comments don't state the obvious
- [ ] No commented-out code remains
- [ ] Documentation matches actual code behavior
