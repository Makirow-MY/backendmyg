import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed


export default async function handlecont(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      if (req.query?.id) {
        // Fetch single contact by id
        const [contactDoc] = await sql`SELECT * FROM contacts WHERE id = ${req.query.id}`;
        if (!contactDoc) {
          return res.status(404).json({
            success: false,
            message: "Contact not found"
          });
        }
        const contact = {
          _id: contactDoc.id,
          clientInfo: {
            firstName: contactDoc.first_name,
            lastName: contactDoc.last_name,
            profilePicture: contactDoc.profile_picture,
            email: contactDoc.email,
            phone: contactDoc.phone,
            company: contactDoc.company,
            country: contactDoc.country,
            referralSource: contactDoc.referral_source,
            contactMethod: contactDoc.contact_method
          },
          engagementType: contactDoc.engagement_type,
          serviceSelection: {
            serviceType: contactDoc.service_type,
            websiteDetails: {
              type: contactDoc.website_type,
              customDescription: contactDoc.website_description,
              defaultPages: contactDoc.website_default_pages,
              additionalPages: contactDoc.website_additional_pages
            },
            appDetails: {
              type: contactDoc.app_type,
              customDescription: contactDoc.app_description,
              defaultScreens: contactDoc.app_default_screens,
              additionalScreens: contactDoc.app_additional_screens
            },
            designDetails: {
              type: contactDoc.design_type,
              customDescription: contactDoc.design_description
            },
            databaseDetails: {
              needs: contactDoc.database_needs
            },
            telecomDetails: {
              needs: contactDoc.telecom_needs,
              customDescription: contactDoc.telecom_description
            },
            employmentDetails: {
              roleType: contactDoc.employment_role_type,
              jobTitle: contactDoc.employment_job_title,
              industry: contactDoc.employment_industry,
              salaryExpectation: contactDoc.employment_salary_expectation,
              jobDescription: contactDoc.employment_job_description
            }
          },
          projectInfo: {
            startDate: contactDoc.start_date,
            deadline: contactDoc.deadline,
            budgetRange: contactDoc.budget_range,
            notes: contactDoc.notes,
            urgency: contactDoc.urgency
          },
          createdAt: contactDoc.createdat,
          updatedAt: contactDoc.updatedat
        };
        return res.json({ success: true, data: contact });
      }
      // Fetch all contacts
      const pgContacts = await sql`SELECT * FROM contacts ORDER BY createdat DESC`;
      const contacts = pgContacts.map(c => ({
        _id: c.id,
        clientInfo: {
          firstName: c.first_name,
          lastName: c.last_name,
          profilePicture: c.profile_picture,
          email: c.email,
          phone: c.phone,
          company: c.company,
          country: c.country,
          referralSource: c.referral_source,
          contactMethod: c.contact_method
        },
        engagementType: c.engagement_type,
        serviceSelection: {
          serviceType: c.service_type,
          websiteDetails: {
            type: c.website_type,
            customDescription: c.website_description,
            defaultPages: c.website_default_pages,
            additionalPages: c.website_additional_pages
          },
          appDetails: {
            type: c.app_type,
            customDescription: c.app_description,
            defaultScreens: c.app_default_screens,
            additionalScreens: c.app_additional_screens
          },
          designDetails: {
            type: c.design_type,
            customDescription: c.design_description
          },
          databaseDetails: {
            needs: c.database_needs
          },
          telecomDetails: {
            needs: c.telecom_needs,
            customDescription: c.telecom_description
          },
          employmentDetails: {
            roleType: c.employment_role_type,
            jobTitle: c.employment_job_title,
            industry: c.employment_industry,
            salaryExpectation: c.employment_salary_expectation,
            jobDescription: c.employment_job_description
          }
        },
        projectInfo: {
          startDate: c.start_date,
          deadline: c.deadline,
          budgetRange: c.budget_range,
          notes: c.notes,
          urgency: c.urgency
        },
        createdAt: c.createdat,
        updatedAt: c.updatedat
      }));
     // console.log("contacts", contacts, "contacts");
      return res.json({ success: true, data: contacts });
    }
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}