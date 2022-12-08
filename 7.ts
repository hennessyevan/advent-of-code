import { importInput } from './utils/importInput'

class File {
  name: string
  size: number
  extension: string
  #parent: Directory

  constructor({
    name = '',
    size = 0,
    extension = '',
    parent,
  }: {
    name?: string
    extension?: string
    size?: number
    parent?: Directory
  }) {
    this.name = name
    this.size = size
    this.extension = extension
    if (parent) {
      this.parent = parent
    }
  }

  get parent() {
    return this.#parent
  }

  set parent(directory: Directory) {
    this.#parent = directory
    directory.files.push(this)
  }
}

class Directory {
  files: File[]
  directories: Directory[]
  name: string
  #parent: Directory

  #getDirectorySize(directory: Directory) {
    let size = 0

    for (const file of directory.files) {
      size += file.size
    }

    for (const subdirectory of directory.directories) {
      size += this.#getDirectorySize(subdirectory)
    }

    return size
  }

  getDirectorySize() {
    return this.#getDirectorySize(this)
  }

  get path() {
    let pathArray: string[] = []
    let currentDirectory: Directory = this

    while (currentDirectory.#parent) {
      pathArray.unshift(currentDirectory.#parent.name)
      currentDirectory = currentDirectory.#parent
    }

    return pathArray.join('/')
  }

  get size() {
    return this.getDirectorySize()
  }

  directory(name: string) {
    return this.directories.find((directory) => directory.name === name)
  }

  constructor({
    name = '',
    parent,
    files = [],
  }: {
    name?: string
    parent?: Directory
    files?: File[]
  }) {
    this.files = files
    this.directories = []
    this.name = name
    if (parent) {
      this.parent = parent
      parent.directories.push(this)
    }
  }

  get parent() {
    return this.#parent
  }

  set parent(directory: Directory) {
    this.#parent = directory
    directory.directories.push(this)
  }
}

function bigDirectories(root: Directory, maxSize: number) {
  const bigDirectories: number[] = []

  function traverse(directory: Directory) {
    const size = directory.getDirectorySize()
    if (size >= maxSize) {
      bigDirectories.push(size)
    }

    for (const subdirectory of directory.directories) {
      traverse(subdirectory)
    }
  }
  traverse(root)

  return bigDirectories //.reduce((a, b) => a + b, 0)
}

function buildDirectoryTree(input: string) {
  const lines = input.split('\n')
  const root = new Directory({ name: '' })

  let currentDirectory = root

  for (const line of lines) {
    if (line.startsWith('$ cd')) {
      const cdPath = line.split(' ')[2]

      if (cdPath === '/') {
        currentDirectory = root
        continue
      }

      if (cdPath === '..') {
        currentDirectory = currentDirectory.parent
        continue
      }

      currentDirectory = currentDirectory.directory(cdPath)!
      continue
    }

    if (line.startsWith('$ ls')) {
      continue
    }

    if (line.startsWith('dir')) {
      const dirName = line.split(' ')[1]
      const directory = new Directory({ name: dirName })
      directory.parent = currentDirectory

      continue
    }

    // file
    if (line.match(/^[0-9]+/)) {
      const [size, filename] = line.split(' ')
      const [name, extension] = filename.split('.')
      const file = new File({
        name,
        size: Number(size),
        extension,
      })

      file.parent = currentDirectory
    }
  }
  return root
}

function part1(input: string) {
  const tree = buildDirectoryTree(input)
  return bigDirectories(tree, 100_000)
}

function part2(input: string) {
  const TOTAL_DISK_SIZE = 70_000_000
  const DESIRED_DISK_SPACE = 30_000_000
  const tree = buildDirectoryTree(input)

  const currentDiskSize = tree.getDirectorySize()
  const availableSpace = TOTAL_DISK_SIZE - currentDiskSize //?
  const neededSpace = DESIRED_DISK_SPACE - availableSpace //?

  const worthwhileDirectories = bigDirectories(tree, neededSpace).sort(
    (a, b) => a - b
  )

  return worthwhileDirectories[0]
}

// console.log(part1(importInput(7)))
console.log(part2(importInput(7)))

function test() {
  const input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
  `
  console.log(part1(input))
}
// test()
