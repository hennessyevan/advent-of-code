use itertools::Itertools;

#[aoc_generator(day6)]
pub fn input_generator(input: &str) -> Vec<String> {
    return input
        .chars()
        .map(|c| c.to_string())
        .collect::<Vec<String>>();
}

#[aoc(day6, part1)]
pub fn solve_part1(input: &Vec<String>) -> usize {
    for i in 0..input.len() {
        if i <= 3 {
            continue;
        };

        let last_4_chars_unique = input[i..i + 4]
            .iter()
            .map(|c| c.to_string())
            .unique()
            .into_iter()
            .count();

        if last_4_chars_unique == 4 {
            return i + 1;
        }
    }

    return 0;
}

#[test]
fn test_day6_part1() {
    let input = "bvwbjplbgvbhsrlpgdmjqwftvncz";
    assert_eq!(solve_part1(&input_generator(input)), 5);
}
