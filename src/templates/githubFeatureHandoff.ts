export const githubFeatureHandoffTemplate = `name: Feature Handoff
description: Create a problem-first feature brief for design and engineering.
title: "[Problem]: "
labels: ["feature-handoff", "needs-design"]
body:
  - type: markdown
    attributes:
      value: |
        Use this form to explain the problem before proposing a feature.

        The issue title should describe the problem, not the solution.

        Good: Users cannot quickly find related equipment  
        Avoid: Add set filter

  - type: input
    id: problem-title
    attributes:
      label: Problem title
      description: Write the problem in one sentence. Avoid naming the solution.
      placeholder: "Users cannot quickly find related equipment"
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What is hard, confusing, slow, risky, or expensive today?
      placeholder: "Users preparing equipment need to manually search through a long list to find items that belong together."
    validations:
      required: true

  - type: textarea
    id: affected-users
    attributes:
      label: Who is affected?
      description: Who has this problem, and when does it happen?
      placeholder: "Operations coordinators preparing equipment before dispatch."
    validations:
      required: true

  - type: dropdown
    id: evidence-type
    attributes:
      label: Evidence type
      description: What makes us believe this problem is real?
      options:
        - User interview
        - Support ticket
        - Analytics
        - Customer request
        - Sales feedback
        - Internal observation
        - Assumption only
    validations:
      required: true

  - type: textarea
    id: evidence
    attributes:
      label: Evidence details
      description: Add links, notes, quotes, data, or context.
      placeholder: "Support mentioned repeated questions about equipment grouping. No user interviews yet."
    validations:
      required: true

  - type: textarea
    id: outcome
    attributes:
      label: Outcome to improve
      description: What should be better if we solve this?
      placeholder: "Reduce time and mistakes when preparing equipment for a job."
    validations:
      required: true

  - type: textarea
    id: constraints
    attributes:
      label: Known constraints
      description: Technical, business, design, legal, data, or timeline constraints.
      placeholder: "Equipment list already has search and filters. Backend support for sets needs confirmation."
    validations:
      required: false

  - type: textarea
    id: example-solution
    attributes:
      label: Example solution
      description: What is one possible solution? This is not the final answer.
      placeholder: "Add a Set filter to the equipment list."
    validations:
      required: true

  - type: textarea
    id: open-questions
    attributes:
      label: Open questions
      description: What still needs discovery?
      placeholder: |
        - Can one item belong to multiple sets?
        - Do users need filtering, grouping, or completeness checking?
        - Is “set” the language users use?
    validations:
      required: false

  - type: textarea
    id: design-ask
    attributes:
      label: Design ask
      description: What should design explore?
      placeholder: "Explore the best way to help users find and prepare related equipment."
    validations:
      required: true
`;
