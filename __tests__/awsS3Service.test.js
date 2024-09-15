import {
  deleteFile,
  uploadFile,
  getFile,
  getAllFiles,
} from "../app/services/s3Service.js";

describe("S3 Service", () => {
  // it("Upload file to S3", async () => {
  //   const file = await uploadFile({
  //     fileBuffer: Buffer.from("Hello World"),
  //     fileName: "hello.txt",
  //     directory: "test",
  //     modifyKey: false,
  //   });

  //   expect(file).toBeTruthy();
  //   expect(file.Location).toBeTruthy();
  // });

  it("Get file from S3", async () => {
    const file = await getFile({
      file: "hello.txt",
      directory: "test",
    });

    console.log(file);

    expect(file).toBeTruthy();
    expect(file.Body).toBeTruthy();
  });

  it("Get all files from S3", async () => {
    const files = await getAllFiles();

    expect(files).toBeTruthy();
    expect(files.Contents.length).toBeGreaterThan(0);
  });

  // it("Delete file from S3", async () => {
  //   const file = await deleteFile({
  //     file: "hello.txt",
  //     directory: "test",
  //   });

  //   expect(file).toBeTruthy();
  // });
});
