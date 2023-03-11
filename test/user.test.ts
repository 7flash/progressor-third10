import {
    assertEquals,
    assertExists,
} from "https://deno.land/std@0.179.0/testing/asserts.ts";

import {
    AbstractUserStorage,
    InMemoryUserStorage,
    User,
} from "../user.ts";

let storage: AbstractUserStorage;

async function setup() {
    await Promise.resolve();
    storage = new InMemoryUserStorage();
}

async function teardown() {
    // Clean up any test resources as needed
}

Deno.test("InMemoryUserStorage: create, get, update and delete user", async () => {
    await setup();

    // Create user
    const user: User = {
        id: 1,
        language: "en",
        name: "John Doe",
        sex: "male",
        traits: ["brave", "honest"],
        race: "human",
        class: "warrior",
        job: "adventurer",
        story: "Once upon a time...",
        image: "https://example.com/image.png",
    };
    await storage.createUser(user);

    // Get user
    const retrievedUser = await storage.getUser(user.id);
    assertExists(retrievedUser);
    assertEquals(retrievedUser, user);

    // Update user
    const updatedUser: User = {
        ...user,
        name: "Jane Doe",
    };
    await storage.updateUser(updatedUser);

    const retrievedUpdatedUser = await storage.getUser(updatedUser.id);
    assertExists(retrievedUpdatedUser);
    assertEquals(retrievedUpdatedUser, updatedUser);

    // Delete user
    await storage.deleteUser(user.id);

    const retrievedDeletedUser = await storage.getUser(user.id);
    assertEquals(retrievedDeletedUser, undefined);

    await teardown();
});
