package entities

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GetUsersReq struct {
	Id        string `json:"id"`
	Status    string `json:"status"`
	IdType    string `json:"idtype"`
	StartDate string `json:"startdate"`
	EndDate   string `json:"enddate"`
	Limit     int    `json:"limit"`
	Page      int    `json:"page"`
	Name      string `json:"name"`
	State     string `json:"state"`
}

type User struct {
	ID           int       `json:"id" db:"id"`
	UUID         uuid.UUID `json:"uuid" db:"uuid"`
	FullName     string    `json:"fullName" db:"full_name"`
	Email        string    `json:"email" db:"email"`
	Msisdn       string    `json:"msisdn" db:"msisdn"`
	UserType     string    `json:"userType" db:"user_type"`
	Status       string    `json:"status" db:"status"`
	Tier         string    `json:"tier" db:"tier"`
	IdentityType string    `json:"identityType" db:"identity_type"`
	ReviewedBy   string    `json:"reviewedBy" db:"reviewed_by"`
	State        string    `json:"state" db:"state"`
	CreatedAt    string    `json:"createdAt" db:"created_at"`
	UpdatedAt    string    `json:"updatedAt" db:"updated_at"`
	DeletedAt    *string   `json:"deletedAt,omitempty" db:"deleted_at"`
}

type UserDetail struct {
	ID             int64     `json:"id" db:"id"`
	UUID           uuid.UUID `json:"uuid" db:"uuid"`
	FullName       string    `json:"fullName" db:"full_name"`
	Email          string    `json:"email" db:"email"`
	Msisdn         string    `json:"msisdn" db:"msisdn"`
	BirthDate      string    `json:"birthDate" db:"birth_date"`
	Gender         string    `json:"gender" db:"gender"`
	Country        string    `json:"country" db:"country"`
	Address        string    `json:"address" db:"address"`
	Province       string    `json:"province" db:"province"`
	City           string    `json:"city" db:"city"`
	District       string    `json:"district" db:"district"`
	SubDistrict    string    `json:"subDistrict" db:"sub_district"`
	PostalCode     string    `json:"postalCode" db:"postal_code"`
	IdentityType   string    `json:"identityType" db:"identity_type"`
	IdentityNumber string    `json:"identityNumber" db:"identity_number"`
	SelfieImage    string    `json:"selfieImage" db:"selfie_image"`
	IdentityImage  string    `json:"identityImage" db:"identity_image"`
	UserType       string    `json:"userType" db:"user_type"`
	Status         string    `json:"status" db:"status"`
	ReviewedBy     string    `json:"reviewedBy" db:"reviewed_by"`
	State          string    `json:"state" db:"state"`
	CreatedAt      time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time `json:"updatedAt" db:"updated_at"`
}

type UserMetrix struct {
	TotalUser           int `db:"total_user" json:"totalUser"`
	TotalAccountBasic   int `db:"total_account_basic" json:"totalAccountBasic"`
	TotalAccountPremium int `db:"total_account_premium" json:"totalAccountPremium"`
	NewUser             int `db:"new_user" json:"newUser"`
	NewUserBasic        int `db:"new_account_basic" json:"newAccountBasic"`
	NewUserPremium      int `db:"new_account_premium" json:"newAccountPremium"`
}

type UserState struct {
	ID_       primitive.ObjectID `bson:"_id" json:"-"`
	UserId    string             `bson:"user_id" json:"userId"`
	State     string             `bson:"state" json:"state"`
	Reason    string             `bson:"reason" json:"reason"`
	ChangedBy string             `bson:"changed_by" json:"changedBy"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time          `bson:"Updated_at" json:"updatedAt"`
}
