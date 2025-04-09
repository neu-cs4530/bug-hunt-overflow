// src/constants/bugHuntRules.ts

const BUGHUNTRULES = `
🐞 Bug Hunt Game – Rules & How to Play

Welcome to Bug Hunt! Your mission is to find and identify bugs in code files as quickly and accurately as possible.

🔍 Objective
Identify all the bugs in a given code snippet. Each file will tell you the maximum number of bugs hidden. Select the buggy lines and submit your guesses.

🕹️ How to Play

1. Select Buggy Lines
   - Click on the line numbers you believe contain bugs.
   - Selected lines will be highlighted.

2. Know the Bug Count
   - Each file shows you how many bugs may be present (e.g. 0/6 Bugs Found).

3. Submit Your Guesses
   - You can make up to 3 total submissions.
   - After each submission, you'll see how many bugs you got:
     - ✅ Correct
     - ❌ Incorrect

4. Use Hints (Optional)
   - Use the Hint button if you’re stuck, but using hints might impact your leaderboard ranking.

5. Race Against the Clock
   - Your time is recorded.
   - Compete to be the fastest and most accurate bug hunter!

🏁 Goal
Submit all correct buggy lines in the shortest time possible using 3 guesses or fewer.

🧠 Tips
- Think like a compiler: syntax, logic, edge cases.
- The bug count is a clue — not every file is packed with problems.
- Don't rush, but don’t overthink. ⚡
`;

export default BUGHUNTRULES;
