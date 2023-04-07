// This test fails because 1 != 2

it('Testing Jest (should fail)', () => {
    expect(1).toBe(2)
})

it('Testing Jest (should pass)', () => {
    expect(1).toBe(1)
})