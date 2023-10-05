import { EditorData, Attachment } from "../../types";
import { v4 as getId } from "uuid";
import dataReducer, { addPollAction, initPollAction } from ".";

describe("Testing DataReducer", () => {
  describe("SET_TITLE", () => {
    it("should return original state when title is not found in state", () => {
      const input: EditorData = { content: "content" };
      const output = dataReducer(input, {
        type: "SET_TITLE",
        payload: "title",
      });
      expect(output).toBe(input);
    });

    it("should change the title based on the payload", () => {
      const input: EditorData = { title: "title_1" };
      const output = dataReducer(input, {
        type: "SET_TITLE",
        payload: "title_2",
      });
      expect(output).toEqual({ title: "title_2" });
    });
  });

  describe("SET_CATEGORY", () => {
    it("should return original state when categories is not found in state", () => {
      const input: EditorData = { title: "title", content: "content" };
      const output = dataReducer(input, {
        type: "SET_CATEGORY",
        payload: "category_1",
      });
      expect(output).toBe(input);
    });

    it("should choose the category from payload when initially no category is chosen", () => {
      const input: EditorData = {
        title: "title",
        categories: [
          { name: "category_1", description: "category", chosen: false },
          { name: "category_2", description: "category", chosen: false },
          { name: "category_3", description: "category", chosen: false },
        ],
      };
      const expectedOutput = {
        title: "title",
        categories: [
          { name: "category_1", description: "category", chosen: true },
          { name: "category_2", description: "category", chosen: false },
          { name: "category_3", description: "category", chosen: false },
        ],
      };
      const output = dataReducer(input, {
        type: "SET_CATEGORY",
        payload: "category_1",
      });

      expect(output).toEqual(expectedOutput);
    });

    it("should choose the category from payload when initially a category is chosen", () => {
      const input: EditorData = {
        title: "title",
        categories: [
          { name: "category_1", description: "category", chosen: false },
          { name: "category_2", description: "category", chosen: true },
          { name: "category_3", description: "category", chosen: false },
        ],
      };
      const expectedOutput = {
        title: "title",
        categories: [
          { name: "category_1", description: "category", chosen: true },
          { name: "category_2", description: "category", chosen: false },
          { name: "category_3", description: "category", chosen: false },
        ],
      };
      const output = dataReducer(input, {
        type: "SET_CATEGORY",
        payload: "category_1",
      });

      expect(output).toEqual(expectedOutput);
    });
  });

  describe("INIT_POLL", () => {
    it("should return original state when a poll already exists", () => {
      const input: EditorData = {
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, initPollAction());
      expect(output).toBe(input);
    });

    it("should initialize three empty options based on payload", () => {
      const input: EditorData = { title: "title", content: "content" };
      const output = dataReducer(input, initPollAction());

      expect(Array.isArray(output.polls)).toBeTruthy();
      expect(output.polls).toHaveLength(3);

      output.polls?.forEach((poll) => {
        expect(typeof poll).toBe("object");

        expect(poll).toHaveProperty("_id");
        expect(poll).toHaveProperty("option");
        expect(poll).toHaveProperty("votes");

        expect(poll.option).toBe("");
      });
    });
  });

  describe("ADD_POLL", () => {
    it("should return original state when a poll is not found in state", () => {
      const input = { content: "content" };
      const output = dataReducer(input, addPollAction());
      expect(output).toBe(input);
    });

    it("should return original state when a poll already has 10 options", () => {
      const input = {
        content: "content",
        polls: [
          { _id: "id", option: "option_1", votes: [] },
          { _id: "id", option: "option_2", votes: [] },
          { _id: "id", option: "option_3", votes: [] },
          { _id: "id", option: "option_4", votes: [] },
          { _id: "id", option: "option_5", votes: [] },
          { _id: "id", option: "option_6", votes: [] },
          { _id: "id", option: "option_7", votes: [] },
          { _id: "id", option: "option_8", votes: [] },
          { _id: "id", option: "option_9", votes: [] },
          { _id: "id", option: "option_10", votes: [] },
        ],
      };
      const output = dataReducer(input, addPollAction());
      expect(output).toBe(input);
    });

    it("should add an empty option for the existing poll", () => {
      const input = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, addPollAction());

      // Check if the output has 4 polls
      expect(output.polls).toHaveLength(4);

      // Check if the original polls are still present in the output
      input.polls.forEach((originalPoll) => {
        expect(output.polls).toContainEqual(originalPoll);
      });

      // Check if last new poll with an empty option
      expect(output.polls?.at(-1)?.option).toBe("");
    });
  });

  describe("SET_POLL", () => {
    it("should return original state when a poll is not found in state", () => {
      const input: EditorData = { content: "content" };
      const output = dataReducer(input, {
        type: "SET_POLL",
        payload: { _id: "1", option: "option_1" },
      });
      expect(output).toBe(input);
    });

    it("should change the option of poll based on payload ID", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const expectedOutput: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2_changed", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, {
        type: "SET_POLL",
        payload: { _id: "2", option: "option_2_changed" },
      });
      expect(output).toEqual(expectedOutput);
    });

    it("should not change the state if payload ID is not found", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, {
        type: "SET_POLL",
        payload: { _id: "4", option: "option_4_changed" },
      });
      expect(output).toEqual(input);
    });
  });

  describe("REMOVE_POLL", () => {
    it("should return original state when a poll is not found in state", () => {
      const input: EditorData = { content: "content" };
      const output = dataReducer(input, {
        type: "REMOVE_POLL",
        payload: "0",
      });
      expect(output).toBe(input);
    });

    it("should return original state when a poll only has 2 options", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
        ],
      };
      const output = dataReducer(input, {
        type: "REMOVE_POLL",
        payload: "1",
      });
      expect(output).toBe(input);
    });

    it("should remove an option from the poll based on payload ID", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const expectedOutput: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, {
        type: "REMOVE_POLL",
        payload: "2",
      });
      expect(output).toEqual(expectedOutput);
    });

    it("should not change the state if payload ID not found", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const expectedOutput: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const output = dataReducer(input, {
        type: "REMOVE_POLL",
        payload: "4",
      });
      expect(output).toEqual(expectedOutput);
    });
  });

  describe("REMOVE_ALL_POLL", () => {
    it("should return original state when a poll is not found in the state", () => {
      const input: EditorData = {
        content: "content",
      };
      const output = dataReducer(input, { type: "REMOVE_ALL_POLL" });
      expect(output).toBe(input);
    });

    it("should remove the `polls` property from the state", () => {
      const input: EditorData = {
        content: "content",
        polls: [
          { _id: "1", option: "option_1", votes: [] },
          { _id: "2", option: "option_2", votes: [] },
          { _id: "3", option: "option_3", votes: [] },
        ],
      };
      const expectedOutput = { content: "content" };
      const output = dataReducer(input, { type: "REMOVE_ALL_POLL" });
      expect(output).toEqual(expectedOutput);
    });
  });

  describe("ADD_ATTACHMENT", () => {
    it("should add an attachment when initally no `attachments` property found", () => {
      const input: EditorData = { title: "title" };
      const newAttachment: Attachment = {
        _id: "1",
        fileName: "file_1",
        fileType: "png",
        url: "www.file_1.com",
      };
      const expectedOutput = {
        title: "title",
        attachments: [newAttachment],
      };

      const output = dataReducer(input, {
        type: "ADD_ATTACHMENT",
        payload: newAttachment,
      });

      expect(output).toEqual(expectedOutput);
    });

    it("should add an attachment when initally `attachments` property is empty array", () => {
      const input: EditorData = { title: "title", attachments: [] };
      const newAttachment: Attachment = {
        _id: "1",
        fileName: "file_1",
        fileType: "png",
        url: "www.file_1.com",
      };
      const expectedOutput = {
        title: "title",
        attachments: [newAttachment],
      };

      const output = dataReducer(input, {
        type: "ADD_ATTACHMENT",
        payload: newAttachment,
      });

      expect(output).toEqual(expectedOutput);
    });

    it("should add an attachment when initally `attachments` property is not empty", () => {
      const oldAttachment: Attachment = {
        _id: "old",
        fileName: "file_old",
        fileType: "png",
        url: "www.file_old.com",
      };
      const newAttachment: Attachment = {
        _id: "new",
        fileName: "file_new",
        fileType: "jpg",
        url: "www.file_new.com",
      };
      const input: EditorData = {
        title: "title",
        attachments: [oldAttachment],
      };

      const expectedOutput = {
        title: "title",
        attachments: [oldAttachment, newAttachment],
      };

      const output = dataReducer(input, {
        type: "ADD_ATTACHMENT",
        payload: newAttachment,
      });

      expect(output).toEqual(expectedOutput);
    });
  });

  describe("REMOVE_ATTACHMENT", () => {
    it("should return original state when `attachments` property is not found in the state", () => {
      const input: EditorData = {
        content: "content",
      };
      const output = dataReducer(input, {
        type: "REMOVE_ATTACHMENT",
        payload: "1",
      });
      expect(output).toBe(input);
    });

    it("should remove an attachment from the poll based on payload ID", () => {
      const input: EditorData = {
        content: "content",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "jpeg",
            url: "www.file_1.com",
          },
          {
            _id: "2",
            fileName: "file_2",
            fileType: "jpeg",
            url: "www.file_2.com",
          },
          {
            _id: "3",
            fileName: "file_3",
            fileType: "jpeg",
            url: "www.file_3.com",
          },
        ],
      };
      const expectedOutput: EditorData = {
        content: "content",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "jpeg",
            url: "www.file_1.com",
          },
          {
            _id: "3",
            fileName: "file_3",
            fileType: "jpeg",
            url: "www.file_3.com",
          },
        ],
      };
      const output = dataReducer(input, {
        type: "REMOVE_ATTACHMENT",
        payload: "2",
      });
      expect(output).toEqual(expectedOutput);
    });

    it("should not change state if payload ID not found", () => {
      const input: EditorData = {
        content: "content",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "jpeg",
            url: "www.file_1.com",
          },
          {
            _id: "2",
            fileName: "file_2",
            fileType: "jpeg",
            url: "www.file_2.com",
          },
          {
            _id: "3",
            fileName: "file_3",
            fileType: "jpeg",
            url: "www.file_3.com",
          },
        ],
      };
      const output = dataReducer(input, {
        type: "REMOVE_ATTACHMENT",
        payload: "4",
      });
      expect(output).toEqual(input);
    });

    it("should remove `attachments` property from the state if the last attachment was removed", () => {
      const input: EditorData = {
        content: "content",
        attachments: [
          {
            _id: "last",
            fileName: "last_file",
            fileType: "jpeg",
            url: "www.last-file.com",
          },
        ],
      };
      const expectedOutput: EditorData = { content: "content" };
      const output = dataReducer(input, {
        type: "REMOVE_ATTACHMENT",
        payload: "last",
      });
      expect(output).toEqual(expectedOutput);
    });
  });

  describe("SET_ATTACHMENT", () => {
    it("should return original state when `attachments` property is not found in the state", () => {
      const input: EditorData = {
        content: "content",
      };
      const output = dataReducer(input, {
        type: "SET_ATTACHMENT",
        payload: { _id: "1", attachment: { url: "example.com" } },
      });
      expect(output).toBe(input);
    });

    it("should set an attachment based on payload ID", () => {
      const input: EditorData = {
        title: "title",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "png",
            url: "www.file_1.com",
          },
          {
            _id: "2",
            fileName: "file_2",
            fileType: "png",
            url: "www.file_2.com",
          },
        ],
      };
      const expectedOutput = {
        title: "title",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "png",
            url: "www.file_1.com",
          },
          {
            _id: "2",
            fileName: "file_2",
            fileType: "png",
            url: "www.file_2.changed.com",
          },
        ],
      };

      const output = dataReducer(input, {
        type: "SET_ATTACHMENT",
        payload: { _id: "2", attachment: { url: "www.file_2.changed.com" } },
      });

      expect(output).toEqual(expectedOutput);
    });

    it("should not change the state if payload ID is not found", () => {
      const input: EditorData = {
        title: "title",
        attachments: [
          {
            _id: "1",
            fileName: "file_1",
            fileType: "png",
            url: "www.file_1.com",
          },
          {
            _id: "2",
            fileName: "file_2",
            fileType: "png",
            url: "www.file_2.com",
          },
        ],
      };
      const output = dataReducer(input, {
        type: "SET_ATTACHMENT",
        payload: { _id: "4", attachment: { fileName: "hehe" } },
      });
      expect(output).toEqual(input);
    });
  });

  describe("UNDEFINED_ACTION_TYPE", () => {
    it("should return original state when received undefined action type", () => {
      const input: EditorData = {
        title: "title",
        content: "content",
      };
      // @ts-ignore Testing the default behavior of the reducer with an undefined action type
      const output = dataReducer(input, { type: "UNDEFINED_ACTION_TYPE" });
      expect(output).toBe(input);
    });
  });
});
