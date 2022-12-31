import ModelFactory from "./Model"

const mockFs = {
  readdirSync: jest.fn().mockReturnValue(["1.yaml", "2.yaml"]),
  readFileSync: jest.fn(fileName => {
    const id = fileName.replace(/^\/base\/test\/(\d*).yaml$/, "$1")
    const name = id === "1" ? "abc" : "def"
    return Buffer.from(`---\nid: ${id}\nname: ${name}`)
  }),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  unlinkSync: jest.fn()
}

const model = ModelFactory("test", "/base", mockFs)

describe("Model", () => {
  it("should read all entity entries", () => {
    const data = model.read()
    expect(data).toEqual([
      { id: "1", name: "abc" },
      { id: "2", name: "def" }
    ])
  })

  it("should write an entity", () => {
    model.write("3", { name: "test" })
    expect(mockFs.writeFileSync).toBeCalledWith(
      "/base/test/3.yaml",
      `---\nname: test\n`
    )
  })

  it("should create the entity folder if it does not exist", () => {
    expect(mockFs.mkdirSync).toBeCalledWith("/base/test", { recursive: true })
  })
})
