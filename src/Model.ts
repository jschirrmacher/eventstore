import { parse, stringify } from "yaml"
import { join } from "path"
import realFs from "fs"

interface FileSystem {
  readdirSync(path: string): string[]
  readFileSync(path: string): Buffer
  writeFileSync(path: string, data: string): void
  mkdirSync(path: string, options: object): void
  unlinkSync(path: string): void
}

export default function ModelFactory<T>(
  entityName: string,
  basePath: string,
  fs: FileSystem = realFs
) {
  const entityBase = join(basePath, entityName)
  fs.mkdirSync(entityBase, { recursive: true })

  function fileReader(name: string) {
    return {
      ...parse(fs.readFileSync(join(entityBase, name)).toString()),
      id: name.replace(/\.yaml$/, "")
    } as T
  }

  return {
    read() {
      return fs.readdirSync(entityBase).map(fileReader)
    },

    write(id: string, data: T) {
      const filePath = join(entityBase, id + ".yaml")
      const dataToWrite = { ...data }
      delete dataToWrite["id"]
      if (data) {
        fs.writeFileSync(filePath, stringify(dataToWrite, null, { directives: true }))
      } else {
        fs.unlinkSync(filePath)
      }
    }
  }
}

export type Model = ReturnType<typeof ModelFactory>
