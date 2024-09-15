import { sendNotification } from "../app/services/notificationService.js";

describe("Notification Service", () => {
  test("Send Notification To Specific User", async () => {
    const result = await sendNotification({
      token: "d7f5b5b6-9d3c-4b8d-8f9a-8d4f7b2b5b7c",
      title: "Notification Title",
      body: "Notification Body",
      data: {
        foo: "bar",
      },
    });

    expect(result).toBeTruthy();
  });
});
