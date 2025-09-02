const { Schema, models, model } = require('mongoose');

const ContactSchema = new Schema({
    clientInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: false
        },
         profilePicture: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: true
        },
        referralSource: {
            type: String,
            required: false
        },
        contactMethod: {
            type: String,
            required: false
        }
    },
    engagementType: {
        type: String,
        enum: ['project', 'employment', 'other'],
        default: 'project'
    },
    serviceSelection: {
        serviceType: {
            type: String,
            enum: ['Website Development', 'App Development', 'Design', 'Database', 'Telecom', 'Employment'],
            default: 'Website Development'
        },
        websiteDetails: {
            type: {
                type: String,
                required: false
            },
            customDescription: {
                type: String,
                required: false
            },
            defaultPages: {
                type: [String],
                default: ['Home', 'About', 'Contact', 'PrivacyPolicy', 'TermsOfService', '404']
            },
            additionalPages: {
                type: [String],
                default: []
            }
        },
        appDetails: {
            type: {
                type: String,
                required: false
            },
            customDescription: {
                type: String,
                required: false
            },
            defaultScreens: {
                type: [String],
                default: ['Splash', 'Auth', 'Home', 'Profile', 'Settings', 'Error']
            },
            additionalScreens: {
                type: [String],
                default: []
            }
        },
        designDetails: {
            type: {
                type: String,
                required: false
            },
            customDescription: {
                type: String,
                required: false
            }
        },
        databaseDetails: {
            needs: {
                type: [String],
                default: []
            }
        },
        telecomDetails: {
            needs: {
                type: [String],
                default: []
            },
            customDescription: {
                type: String,
                required: false
            }
        },
        employmentDetails: {
            roleType: {
                type: String,
                required: false
            },
            jobTitle: {
                type: String,
                required: false
            },
            industry: {
                type: String,
                required: false
            },
            salaryExpectation: {
                type: String,
                required: false
            },
            jobDescription: {
                type: String,
                required: false
            }
        }
    },
    projectInfo: {
        startDate: {
            type: String,
            required: false
        },
        deadline: {
            type: String,
            required: false
        },
        budgetRange: {
            type: String,
            required: false
        },
        notes: {
            type: String,
            required: false
        },
        urgency: {
            type: String,
            required: false
        }
    }
}, {
    timestamps: true
});

export const Contact = models.Contact || model('Contact', ContactSchema, 'contacts');