---
name: kannada-advisory
description: Rewrite computed fertiliser advice into simple spoken Kannada (or English) for low-literacy farmers, without changing any number. Use after the dose engine has produced a plan.
---
# Kannada advisory
- Input: the plan facts JSON and the template draft from `explain()`. Output: plain text, short sentences, no markdown.
- Use ONLY numbers present in the facts. Keep every product and quantity. Add no products, doses, pesticides.
- The server runs `numbersAreGrounded()` on the output; any invented number discards the rewrite and the template is used.
- Vocabulary: ಯೂರಿಯಾ, ಡಿಎಪಿ, ಪೊಟ್ಯಾಶ್, ಚೀಲ, ಕೆಜಿ, ಎಕರೆ, ಬಿತ್ತನೆ, ಮೇಲುಗೊಬ್ಬರ. Have a native speaker and an agronomist review every new phrase before pilot use.
