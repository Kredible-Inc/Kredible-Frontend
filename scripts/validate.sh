#!/bin/bash

echo "🔍 Running all validations..."
echo "================================"

# Run lint-staged
echo "📝 Running lint-staged..."
npx lint-staged
LINT_EXIT_CODE=$?

echo ""
echo "🏗️  Running build..."
npm run build
BUILD_EXIT_CODE=$?

echo ""
echo "================================"
echo "📊 Validation Results:"
echo "================================"

if [ $LINT_EXIT_CODE -eq 0 ]; then
    echo "✅ Lint-staged: PASSED"
else
    echo "❌ Lint-staged: FAILED"
fi

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build: PASSED"
else
    echo "❌ Build: FAILED"
fi

echo "================================"

# Exit with error if any validation failed
if [ $LINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ Some validations failed. Please fix the errors above."
    exit 1
else
    echo "🎉 All validations passed!"
    exit 0
fi 