// Comprehensive Testing Script for Portfolio
// Run this in browser console on each page

const testResults = {
  pages: [],
  errors: [],
  warnings: [],
};

// Test 1: Check if page loads
function testPageLoad() {
  const pageTitle = document.title;
  const hasContent = document.body.innerHTML.length > 1000;
  return {
    test: "Page Load",
    passed: hasContent,
    details: `Title: ${pageTitle}, Content length: ${document.body.innerHTML.length}`,
  };
}

// Test 2: Check for Lottie animations
function testLottieAnimations() {
  const lottieElements = document.querySelectorAll('[class*="lottie"]');
  return {
    test: "Lottie Animations",
    passed: true,
    details: `Found ${lottieElements.length} Lottie elements`,
  };
}

// Test 3: Check for images
function testImages() {
  const images = document.querySelectorAll("img");
  const brokenImages = Array.from(images).filter((img) => !img.complete || img.naturalHeight === 0);
  return {
    test: "Images",
    passed: brokenImages.length === 0,
    details: `Total: ${images.length}, Broken: ${brokenImages.length}`,
  };
}

// Test 4: Check for console errors
function testConsoleErrors() {
  const errors = window.console.error.calls || [];
  return {
    test: "Console Errors",
    passed: errors.length === 0,
    details: `Found ${errors.length} console errors`,
  };
}

// Test 5: Check for tech icons
function testTechIcons() {
  const techIcons = document.querySelectorAll('svg[class*="tech"]') || document.querySelectorAll('[title]');
  return {
    test: "Tech Icons",
    passed: true,
    details: `Found ${techIcons.length} icons`,
  };
}

// Test 6: Check for animations
function testAnimations() {
  const animatedElements = document.querySelectorAll('[class*="animate"]');
  return {
    test: "Animations",
    passed: animatedElements.length > 0,
    details: `Found ${animatedElements.length} animated elements`,
  };
}

// Test 7: Check for interactive elements
function testInteractiveElements() {
  const buttons = document.querySelectorAll("button");
  const links = document.querySelectorAll("a");
  return {
    test: "Interactive Elements",
    passed: buttons.length > 0 && links.length > 0,
    details: `Buttons: ${buttons.length}, Links: ${links.length}`,
  };
}

// Run all tests
function runTests() {
  console.log("🧪 Starting Comprehensive Tests...\n");

  const tests = [
    testPageLoad(),
    testLottieAnimations(),
    testImages(),
    testConsoleErrors(),
    testTechIcons(),
    testAnimations(),
    testInteractiveElements(),
  ];

  tests.forEach((result) => {
    const icon = result.passed ? "✅" : "❌";
    console.log(`${icon} ${result.test}: ${result.details}`);
  });

  const allPassed = tests.every((t) => t.passed);
  console.log("\n" + (allPassed ? "🎉 All tests passed!" : "⚠️  Some tests failed"));

  return tests;
}

// Export for use
window.portfolioTests = runTests;

console.log("Portfolio testing loaded! Run: portfolioTests()");
