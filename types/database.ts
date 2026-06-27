export type ResourceType =
  | 'ngo'
  | 'campaign'
  | 'collection_point'
  | 'psychological'
  | 'medical'
  | 'animal_rescue'
  | 'missing_persons'
  | 'portal'
  | 'business'
  | 'volunteer_coordinator'
  | 'other'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export type NeedType = 'food' | 'medicine' | 'find_person' | 'trapped' | 'other'

export type HelpRequestStatus = 'active' | 'resolved'

export type Country = 'VE' | 'ES' | 'INT' | string

export interface Resource {
  id: string
  name: string
  type: ResourceType
  url: string | null
  instagram: string | null
  city: string | null
  country: Country
  description_es: string | null
  description_en: string | null
  contact: string | null
  verified: boolean
  active: boolean
  created_at: string
  earthquake_specific: boolean
  is_government: boolean
}

export interface Submission {
  id: string
  type: ResourceType
  name: string
  url: string | null
  instagram: string | null
  city: string | null
  country: Country
  submitter_email: string
  description: string | null
  status: SubmissionStatus
  ai_verified: boolean | null
  ai_notes: string | null
  created_at: string
}

export interface HelpRequest {
  id: string
  full_name: string
  location: string
  needs: NeedType[]
  details: string | null
  status: HelpRequestStatus
  created_at: string
}

export interface Business {
  id: string
  business_name: string
  description: string
  how_helping: string
  contact_url: string | null
  city: string | null
  country: Country
  created_at: string
}

export type SkillCategory =
  | 'translator'
  | 'medical'
  | 'psychological'
  | 'legal'
  | 'it'
  | 'design'
  | 'pr'
  | 'logistics'
  | 'construction'
  | 'other'

export type SkillAvailability = 'remote' | 'local' | 'both'

export interface SkillOffer {
  id: string
  full_name: string
  skill_category: SkillCategory
  skill_description: string
  availability: SkillAvailability
  location: string | null
  contact_method: string
  contact_value: string
  active: boolean
  created_at: string
}

export type SkillOfferInsert = Omit<SkillOffer, 'id' | 'created_at' | 'active'>

export type InitiativeCategory =
  | 'logistics'
  | 'medical'
  | 'food'
  | 'rescue'
  | 'psychosocial'
  | 'translation'
  | 'collection'
  | 'coordination'
  | 'other'

export interface VolunteerInitiative {
  id: string
  title: string
  description: string
  location: string
  coordinator_name: string
  needed_skills: string[]
  spots_available: number | null
  category: InitiativeCategory
  created_at: string
}

export type ResourceInsert = Omit<Resource, 'id' | 'created_at'>
export type SubmissionInsert = Omit<Submission, 'id' | 'created_at'>
export type HelpRequestInsert = Omit<HelpRequest, 'id' | 'created_at'>
export type BusinessInsert = Omit<Business, 'id' | 'created_at'>

export interface Database {
  public: {
    Tables: {
      resources: {
        Row: Resource
        Insert: ResourceInsert
        Update: Partial<ResourceInsert>
        Relationships: []
      }
      submissions: {
        Row: Submission
        Insert: SubmissionInsert
        Update: Partial<SubmissionInsert>
        Relationships: []
      }
      help_requests: {
        Row: HelpRequest
        Insert: HelpRequestInsert
        Update: Partial<HelpRequestInsert>
        Relationships: []
      }
      businesses: {
        Row: Business
        Insert: BusinessInsert
        Update: Partial<BusinessInsert>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
