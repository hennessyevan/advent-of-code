#[aoc_generator(day1)]
pub fn input_generator(input: &str) -> Vec<Vec<u32>> {
    let lines = input.lines();
    let mut result: Vec<Vec<u32>> = Vec::new();
    let mut elf_index = 0;

    for line in lines {
        if line == "" {
            elf_index += 1;
            continue;
        }
        if result.len() <= elf_index {
            result.push(Vec::new());
        }
        result[elf_index].push(line.parse::<u32>().unwrap());
    }

    return result;
}

#[aoc(day1, part1)]
pub fn solve_part1(input: &[Vec<u32>]) -> u32 {
    let mut most_calories = 0;
    for elf in input {
        let calories = elf.iter().sum();
        if calories > most_calories {
            most_calories = calories;
        }
    }

    return most_calories;
}
