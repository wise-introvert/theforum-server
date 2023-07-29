import "reflect-metadata";
import { buildMakeUser } from "./service";

const hashFunction = jest.fn((value: string): string => `hash_${value}`);
const md5 = jest.fn((value: string): string => `md5_${value}`);
const findUserByHash = jest.fn();
const createID = jest.fn((): string => `some-random-id`);

let makeUser: Function;
let unhappyUserInput = {
  username: "a",
  password: "p",
  email: "invalid",
};
let happyUserInput = {
  username: "some-user",
  password: "SomeUser!@#4",
  email: "some@user.com",
};
describe("makeUser", () => {
  beforeAll(() => {
    makeUser = buildMakeUser({ hashFunction, md5, findUserByHash, createID });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user, provided unique details", async () => {
    findUserByHash.mockReturnValueOnce(null);

    const output = await makeUser(happyUserInput);

    expect(hashFunction).toHaveBeenCalledTimes(1);
    expect(md5).toHaveBeenCalledTimes(2);
    expect(findUserByHash).toHaveBeenCalledTimes(1);
    expect(createID).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      getID: expect.any(Function),
      getUsername: expect.any(Function),
      getEmail: expect.any(Function),
      getDescription: expect.any(Function),
      getPasswordHash: expect.any(Function),
      getHash: expect.any(Function),
      getAvatar: expect.any(Function),
      isVerified: expect.any(Function),
      isArchived: expect.any(Function),
      getLastActive: expect.any(Function),
    });
  });

  it("should return an existing user", async () => {
    findUserByHash.mockReturnValueOnce({
      id: "existing-id",
      username: "some-user",
      password: "hash_SomeUser!@#4",
      email: "some@user.com",
    });

    const output = await makeUser(happyUserInput);

    expect(output).toEqual({
      getID: expect.any(Function),
      getUsername: expect.any(Function),
      getEmail: expect.any(Function),
      getDescription: expect.any(Function),
      getPasswordHash: expect.any(Function),
      getHash: expect.any(Function),
      getAvatar: expect.any(Function),
      isVerified: expect.any(Function),
      isArchived: expect.any(Function),
      getLastActive: expect.any(Function),
    });

    expect(output.getID()).toBe("existing-id");
    expect(output.getUsername()).toBe("some-user");
    expect(output.getPasswordHash()).toBe("hash_SomeUser!@#4");
  });

  it("should throw an error provided unhappy case", async () => {
    await expect(makeUser(unhappyUserInput)).rejects.toThrow();
  });

  it("should not allow invalid usernames", async () => {
    await expect(
      makeUser({
        ...happyUserInput,
        username: "to",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        username: "!!$#)(*)",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        username: "thisusernameiswaytoolong",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        username: "root",
      })
    ).rejects.toThrow();
  });

  it("should not allow invalid/unsafe passwords", async () => {
    await expect(
      makeUser({
        ...happyUserInput,
        password: "",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        password: "1",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        password: "thispasswordiswaytoolongforapassword",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        password: ")&^(&*^(*^(&*^))",
      })
    ).rejects.toThrow();
    await expect(
      makeUser({
        ...happyUserInput,
        password: "0198509810598",
      })
    ).rejects.toThrow();
  });

  it("should not allow invalid email address", async () => {
    await expect(
      makeUser({
        ...happyUserInput,
        email: "invalid.email",
      })
    ).rejects.toThrow();

    await expect(
      makeUser({
        ...happyUserInput,
        email: "invalid@domain",
      })
    ).rejects.toThrow();

    await expect(
      makeUser({
        ...happyUserInput,
        email: "invalid email@example.com",
      })
    ).rejects.toThrow();
  });

  it("should not override any provided values with default values", async () => {
    const output = await makeUser({
      ...happyUserInput,
      description: "non empty description",
    });

    expect(output.getDescription()).toBe("non empty description");
  });

  it("should use the deafult avatar url if one is not provided", async () => {
    const output = await makeUser(happyUserInput);

    expect(output.getAvatar()).toBeTruthy();
  });

  it("should set the correct default boolean values", async () => {
    const output = await makeUser(happyUserInput);

    expect(output.isVerified()).toBeFalsy();
    expect(output.isArchived()).toBeFalsy();
  });

  it("should generate id by default", async () => {
    const output = await makeUser(happyUserInput);

    expect(output.getID()).toBeTruthy();
  });

  it("should not generate id if already provided", async () => {
    const output = await makeUser({
      ...happyUserInput,
      id: "some-user-id",
    });

    expect(output.getID()).toEqual("some-user-id");
  });
});
