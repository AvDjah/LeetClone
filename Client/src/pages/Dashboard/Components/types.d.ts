const dummyPersonalQuestion = {
    "id": "64dcff588b85c88fadd99bdf",
    "attempted": [
        "201",
        "2012"
    ],
    "email": "arvind@gm.com"
}


export type Question = {
    id: bigint
    title: string
    description: string
    difficulty: string
    solution_link: string
    acceptance_rate: number
    url: string
    submissions: number
}


export type PersonalQuestion = typeof  dummyPersonalQuestion