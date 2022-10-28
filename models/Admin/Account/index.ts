import { JobPagingProps } from "models/HomePage"

export interface SubmitUpdateUserProps<T> {
	firstName: T
    lastName: T
	gender: T
    phone :T
	email: T
    facebook: T
    birthday: any
}
export interface SubmittedProps {
    appointmentAt: string
    status: string
    uuid: string
    job: JobPagingProps<string>
}
export interface SavedProps {
    uuid: string
    job: JobPagingProps<string>
}
export interface WorkExperienceProps<T> {
    company_name: T
    createdAt: T
    description: T
    endAt: T
    isCurrent: number
    positon: T
    startAt: T
    updatedAt: T
    uuid: T
}
export interface ActivitiesProps<T> {
    uuid: T
    name: T
    activity: T
    description: T
    startAt:T
    endAt: T
}
export interface CvProps<T> {
    address: T
    company_name: T
    createdAt: T
    cv_name: T
    full_name: T
    work_experience: WorkExperienceProps<string>[]
    gender: T
    level: T
    phone: T
    salary: number
    activities: ActivitiesProps<string>[]
    specialized: T
    status: T
    updatedAt: T
    userUuid: T
    skills: any
    user: {
        avatar: T
        uuid: T
    }
    uuid: T
    website: T
    email: T
    format: {
        createdAt: T
        description: T
        name: T
        updatedAt: T
        id: number
    }[]
    description: T
    educations: {
        createdAt: T
        description: T
        endAt: T
        major: T
        school_name: T
        startAt: T
        updatedAt: T
        uuid: T
    }[]
    certifications: {
        certification :T
        createdAt: T
        updatedAt: T
        description: T
        uuid: T
        organization: T
        link_certification: T
    }[]
    career_goals: T
    birth_day: T
    benefit: T[]
    age: number
}
export interface AdminProps {
    listSaved: SavedProps[]
    cvDetail: CvProps<string>
    listSubmitted: {
        data: SubmittedProps[]
        links: any
        meta: any
    }
}