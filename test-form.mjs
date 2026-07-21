async function testSubmit() {
  try {
    const response = await fetch("https://formsubmit.co/ajax/info@thrivefusion.org", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://thrivefusion.org',
        'Referer': 'https://thrivefusion.org/contact'
      },
      body: JSON.stringify({
        name: "Test Automation",
        email: "test@example.com",
        message: "This is a test message to activate FormSubmit and verify the contact form integration.",
        _subject: `New Enquiry: General Contact from Test Automation`,
        _template: "table"
      })
    });

    const result = await response.json();
    console.log("FormSubmit Result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSubmit();
