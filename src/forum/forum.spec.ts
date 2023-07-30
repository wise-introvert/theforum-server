import "reflect-metadata";
import { buildMakeForum } from "./service";

const md5 = jest.fn((value: string): string => `md5_${value}`);
const findForumByHash = jest.fn();
const findAuthorById = jest.fn();
const createID = jest.fn((): string => `some-random-id`);

let makeForum: Function;
let forumInput = {
  title: "New Forum",
  author: "some-author-id",
};
describe("makeForum", () => {
  beforeAll(() => {
    makeForum = buildMakeForum({
      md5,
      findForumByHash,
      findAuthorById,
      createID,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new forum, given unique forum details", async () => {
    findAuthorById.mockReturnValueOnce({
      id: "some-author-id",
      username: "some-username",
    });

    const output = await makeForum(forumInput);

    expect(md5).toHaveBeenCalledTimes(2);
    expect(findAuthorById).toHaveBeenCalledTimes(1);
    expect(findForumByHash).toHaveBeenCalledTimes(1);
    expect(createID).toHaveBeenCalledTimes(1);

    expect(output).toEqual({
      getID: expect.any(Function),
      getTitle: expect.any(Function),
      getDescription: expect.any(Function),
      getImage: expect.any(Function),
      getAuthorID: expect.any(Function),
      getThreadIDs: expect.any(Function),
    });
  });

  it("should return an existing forum, given id", async () => {
    findForumByHash.mockReturnValueOnce({
      id: "some-forum-id",
      title: "New Forum",
    });
    findAuthorById.mockReturnValueOnce({
      id: "some-author-id",
      username: "some-username",
    });

    const output = await makeForum({
      ...forumInput,
    });

    expect(output.getID()).toEqual("some-forum-id");
  });
});
