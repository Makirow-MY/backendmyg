import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_P6GLxeoWFS5u@ep-curly-heart-ae2jb0gb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'); // Use process.env.DATABASE_URL if needed

 
export default async function handlecont(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      const { userId, name, lname, email, price, company, country, description, phone, project } = req.body;

      if (userId) {
        // Delete contact by id
        await sql`DELETE FROM contacts WHERE id = ${userId}`;
        const pgContacts = await sql`SELECT * FROM contacts ORDER BY createdat DESC`;
        const contacts = pgContacts.map(c => ({
          _id: c.id,
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          phone: c.phone,
          company: c.company,
          country: c.country,
          notes: c.notes,
          budgetRange: c.budget_range,
          engagementType: c.engagement_type,
          createdAt: c.createdat,
          updatedAt: c.updatedat,
          profilePicture: c.profile_picture,
          referralSource: c.referral_source,
          contactMethod: c.contact_method,
          serviceType: c.service_type,
          websiteType: c.website_type,
          websiteDescription: c.website_description,
          websiteDefaultPages: c.website_default_pages,
          websiteAdditionalPages: c.website_additional_pages,
          appType: c.app_type,
          appDescription: c.app_description,
          appDefaultScreens: c.app_default_screens,
          appAdditionalScreens: c.app_additional_screens,
          designType: c.design_type,
          designDescription: c.design_description,
          databaseNeeds: c.database_needs,
          telecomNeeds: c.telecom_needs,
          telecomDescription: c.telecom_description,
          employmentRoleType: c.employment_role_type,
          employmentJobTitle: c.employment_job_title,
          employmentIndustry: c.employment_industry,
          employmentSalaryExpectation: c.employment_salary_expectation,
          employmentJobDescription: c.employment_job_description,
          startDate: c.start_date,
          deadline: c.deadline,
          urgency: c.urgency
        }));
        return res.json({ success: true, data: contacts });
      }

      if (name && email && description && company && country && phone && price) {
        // Create new contact
        const [contactDoc] = await sql`
          INSERT INTO contacts (
            first_name, last_name, email, phone, company, country, notes, budget_range, engagement_type,
            createdat, updatedat
          )
          VALUES (
            ${name}, ${lname || ''}, ${email}, ${phone}, ${company}, ${country}, ${description}, ${price},
            ${project || 'project'}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
          RETURNING *
        `;
        const contact = {
          _id: contactDoc.id,
          firstName: contactDoc.first_name,
          lastName: contactDoc.last_name,
          email: contactDoc.email,
          phone: contactDoc.phone,
          company: contactDoc.company,
          country: contactDoc.country,
          notes: contactDoc.notes,
          budgetRange: contactDoc.budget_range,
          engagementType: contactDoc.engagement_type,
          createdAt: contactDoc.createdat,
          updatedAt: contactDoc.updatedat,
          profilePicture: contactDoc.profile_picture,
          referralSource: contactDoc.referral_source,
          contactMethod: contactDoc.contact_method,
          serviceType: contactDoc.service_type,
          websiteType: contactDoc.website_type,
          websiteDescription: contactDoc.website_description,
          websiteDefaultPages: contactDoc.website_default_pages,
          websiteAdditionalPages: contactDoc.website_additional_pages,
          appType: contactDoc.app_type,
          appDescription: contactDoc.app_description,
          appDefaultScreens: contactDoc.app_default_screens,
          appAdditionalScreens: contactDoc.app_additional_screens,
          designType: contactDoc.design_type,
          designDescription: contactDoc.design_description,
          databaseNeeds: contactDoc.database_needs,
          telecomNeeds: contactDoc.telecom_needs,
          telecomDescription: contactDoc.telecom_description,
          employmentRoleType: contactDoc.employment_role_type,
          employmentJobTitle: contactDoc.employment_job_title,
          employmentIndustry: contactDoc.employment_industry,
          employmentSalaryExpectation: contactDoc.employment_salary_expectation,
          employmentJobDescription: contactDoc.employment_job_description,
          startDate: contactDoc.start_date,
          deadline: contactDoc.deadline,
          urgency: contactDoc.urgency
        };
        return res.json({ success: true, data: contact });
      }

      return res.status(400).json({ success: false, message: "Missing required fields" });
    } else if (method === "GET") {
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
          firstName: contactDoc.first_name,
          lastName: contactDoc.last_name,
          email: contactDoc.email,
          phone: contactDoc.phone,
          company: contactDoc.company,
          country: contactDoc.country,
          notes: contactDoc.notes,
          budgetRange: contactDoc.budget_range,
          engagementType: contactDoc.engagement_type,
          createdAt: contactDoc.createdat,
          updatedAt: contactDoc.updatedat,
          profilePicture: contactDoc.profile_picture,
          referralSource: contactDoc.referral_source,
          contactMethod: contactDoc.contact_method,
          serviceType: contactDoc.service_type,
          websiteType: contactDoc.website_type,
          websiteDescription: contactDoc.website_description,
          websiteDefaultPages: contactDoc.website_default_pages,
          websiteAdditionalPages: contactDoc.website_additional_pages,
          appType: contactDoc.app_type,
          appDescription: contactDoc.app_description,
          appDefaultScreens: contactDoc.app_default_screens,
          appAdditionalScreens: contactDoc.app_additional_screens,
          designType: contactDoc.design_type,
          designDescription: contactDoc.design_description,
          databaseNeeds: contactDoc.database_needs,
          telecomNeeds: contactDoc.telecom_needs,
          telecomDescription: contactDoc.telecom_description,
          employmentRoleType: contactDoc.employment_role_type,
          employmentJobTitle: contactDoc.employment_job_title,
          employmentIndustry: contactDoc.employment_industry,
          employmentSalaryExpectation: contactDoc.employment_salary_expectation,
          employmentJobDescription: contactDoc.employment_job_description,
          startDate: contactDoc.start_date,
          deadline: contactDoc.deadline,
          urgency: contactDoc.urgency
        };
        return res.json({ success: true, data: contact });
      }

      // Fetch all contacts
      const pgContacts = await sql`SELECT * FROM contacts ORDER BY createdat DESC`;
      const contacts = pgContacts.map(c => ({
        _id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        country: c.country,
        notes: c.notes,
        budgetRange: c.budget_range,
        engagementType: c.engagement_type,
        createdAt: c.createdat,
        updatedAt: c.updatedat,
        profilePicture: c.profile_picture,
        referralSource: c.referral_source,
        contactMethod: c.contact_method,
        serviceType: c.service_type,
        websiteType: c.website_type,
        websiteDescription: c.website_description,
        websiteDefaultPages: c.website_default_pages,
        websiteAdditionalPages: c.website_additional_pages,
        appType: c.app_type,
        appDescription: c.app_description,
        appDefaultScreens: c.app_default_screens,
        appAdditionalScreens: c.app_additional_screens,
        designType: c.design_type,
        designDescription: c.design_description,
        databaseNeeds: c.database_needs,
        telecomNeeds: c.telecom_needs,
        telecomDescription: c.telecom_description,
        employmentRoleType: c.employment_role_type,
        employmentJobTitle: c.employment_job_title,
        employmentIndustry: c.employment_industry,
        employmentSalaryExpectation: c.employment_salary_expectation,
        employmentJobDescription: c.employment_job_description,
        startDate: c.start_date,
        deadline: c.deadline,
        urgency: c.urgency
      }));
      return res.json({ success: true, data: contacts });
    } else if (method === "PUT") {
      const { _id, ...updateData } = req.body;
      if (!_id) {
        return res.status(400).json({
          success: false,
          message: "Missing contact ID"
        });
      }

      // Map updateData to SQL columns
      const fields = {
        first_name: updateData.firstName,
        last_name: updateData.lastName,
        email: updateData.email,
        phone: updateData.phone,
        company: updateData.company,
        country: updateData.country,
        notes: updateData.notes,
        budget_range: updateData.budgetRange,
        engagement_type: updateData.engagementType,
        profile_picture: updateData.profilePicture,
        referral_source: updateData.referralSource,
        contact_method: updateData.contactMethod,
        service_type: updateData.serviceType,
        website_type: updateData.websiteType,
        website_description: updateData.websiteDescription,
        website_default_pages: updateData.websiteDefaultPages ? JSON.stringify(updateData.websiteDefaultPages) : undefined,
        website_additional_pages: updateData.websiteAdditionalPages ? JSON.stringify(updateData.websiteAdditionalPages) : undefined,
        app_type: updateData.appType,
        app_description: updateData.appDescription,
        app_default_screens: updateData.appDefaultScreens ? JSON.stringify(updateData.appDefaultScreens) : undefined,
        app_additional_screens: updateData.appAdditionalScreens ? JSON.stringify(updateData.appAdditionalScreens) : undefined,
        design_type: updateData.designType,
        design_description: updateData.designDescription,
        database_needs: updateData.databaseNeeds ? JSON.stringify(updateData.databaseNeeds) : undefined,
        telecom_needs: updateData.telecomNeeds ? JSON.stringify(updateData.telecomNeeds) : undefined,
        telecom_description: updateData.telecomDescription,
        employment_role_type: updateData.employmentRoleType,
        employment_job_title: updateData.employmentJobTitle,
        employment_industry: updateData.employmentIndustry,
        employment_salary_expectation: updateData.employmentSalaryExpectation,
        employment_job_description: updateData.employmentJobDescription,
        start_date: updateData.startDate,
        deadline: updateData.deadline,
        urgency: updateData.urgency,
        updatedat: new Date()
      };

      // Filter out undefined fields
      const validFields = Object.entries(fields)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(validFields).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update"
        });
      }

      // Build dynamic SET clause
      const setClause = Object.keys(validFields)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
      const values = Object.values(validFields);

      const [updated] = await sql`
        UPDATE contacts
        SET ${sql.unsafe(setClause)}
        WHERE id = ${parseInt(_id)}
        RETURNING *
      `;

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Contact not found"
        });
      }

      const updatedContact = {
        _id: updated.id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        phone: updated.phone,
        company: updated.company,
        country: updated.country,
        notes: updated.notes,
        budgetRange: updated.budget_range,
        engagementType: updated.engagement_type,
        createdAt: updated.createdat,
        updatedAt: updated.updatedat,
        profilePicture: updated.profile_picture,
        referralSource: updated.referral_source,
        contactMethod: updated.contact_method,
        serviceType: updated.service_type,
        websiteType: updated.website_type,
        websiteDescription: updated.website_description,
        websiteDefaultPages: updated.website_default_pages,
        websiteAdditionalPages: updated.website_additional_pages,
        appType: updated.app_type,
        appDescription: updated.app_description,
        appDefaultScreens: updated.app_default_screens,
        appAdditionalScreens: updated.app_additional_screens,
        designType: updated.design_type,
        designDescription: updated.design_description,
        databaseNeeds: updated.database_needs,
        telecomNeeds: updated.telecom_needs,
        telecomDescription: updated.telecom_description,
        employmentRoleType: updated.employment_role_type,
        employmentJobTitle: updated.employment_job_title,
        employmentIndustry: updated.employment_industry,
        employmentSalaryExpectation: updated.employment_salary_expectation,
        employmentJobDescription: updated.employment_job_description,
        startDate: updated.start_date,
        deadline: updated.deadline,
        urgency: updated.urgency
      };

      return res.json({
        success: true,
        data: updatedContact,
        message: "Contact updated"
      });
    } else if (method === "DELETE") {
      if (!req.query?.id) {
        return res.status(400).json({
          success: false,
          message: "Missing ID parameter"
        });
      }

      const [deleted] = await sql`
        DELETE FROM contacts
        WHERE id = ${req.query.id}
        RETURNING *
      `;

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Contact not found"
        });
      }

      return res.json({
        success: true,
        message: "Contact deleted"
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}