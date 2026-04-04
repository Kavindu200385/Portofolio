// @ts-nocheck
/**
 * Inserts built-in portfolio content into MongoDB only when each collection is empty.
 * Does not delete or overwrite existing documents (safe to run on a partially filled DB).
 */
import { defaultPortfolioContent } from "./defaultPortfolioContent.js";
import { normalizeProjectBody } from "./api/projectBody.js";
import { normalizeSkillBody } from "./api/skillBody.js";
import { experienceFromClient } from "./api/experienceBody.js";
import { educationFromClient } from "./api/educationBody.js";
import { aboutFromClient, contactFromClient, heroFromClient } from "./api/singletonPayloads.js";
import About from "../models/About.js";
import Contact from "../models/Contact.js";
import Education from "../models/Education.js";
import Experience from "../models/Experience.js";
import Hero from "../models/Hero.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";

export async function seedDefaultPortfolioIfEmpty() {
  const summary = {
    projectsInserted: 0,
    skillsInserted: 0,
    experiencesInserted: 0,
    educationInserted: 0,
    aboutSeeded: false,
    heroSeeded: false,
    contactSeeded: false,
  };

  if ((await Project.countDocuments()) === 0) {
    for (let i = 0; i < defaultPortfolioContent.projects.length; i++) {
      const raw = normalizeProjectBody(defaultPortfolioContent.projects[i]);
      await new Project({ ...raw, order: i }).save();
      summary.projectsInserted++;
    }
  }

  if ((await Skill.countDocuments()) === 0) {
    for (let i = 0; i < defaultPortfolioContent.skills.length; i++) {
      const raw = normalizeSkillBody(defaultPortfolioContent.skills[i]);
      await new Skill({ ...raw, order: i }).save();
      summary.skillsInserted++;
    }
  }

  if ((await Experience.countDocuments()) === 0) {
    for (let i = 0; i < defaultPortfolioContent.experiences.length; i++) {
      const raw = experienceFromClient(defaultPortfolioContent.experiences[i]);
      await new Experience({ ...raw, order: i }).save();
      summary.experiencesInserted++;
    }
  }

  if ((await Education.countDocuments()) === 0) {
    for (let i = 0; i < defaultPortfolioContent.education.length; i++) {
      const raw = educationFromClient(defaultPortfolioContent.education[i]);
      await new Education({ ...raw, order: i }).save();
      summary.educationInserted++;
    }
  }

  if (!(await About.findOne())) {
    const payload = aboutFromClient({
      paragraphs: defaultPortfolioContent.about.paragraphs,
      badges: defaultPortfolioContent.about.badges,
      profilePhoto: defaultPortfolioContent.about.profilePhoto,
    });
    await About.findOneAndUpdate({}, payload, { upsert: true, new: true });
    summary.aboutSeeded = true;
  }

  if (!(await Hero.findOne())) {
    const payload = heroFromClient({
      heading: defaultPortfolioContent.hero.heading,
      subHeading: defaultPortfolioContent.hero.subHeading,
      cta1Label: defaultPortfolioContent.hero.cta1Label,
      cta1Link: defaultPortfolioContent.hero.cta1Link,
      cta2Label: defaultPortfolioContent.hero.cta2Label,
      cta2Link: defaultPortfolioContent.hero.cta2Link,
      heroPhoto: defaultPortfolioContent.hero.heroPhoto,
    });
    await Hero.findOneAndUpdate({}, payload, { upsert: true, new: true });
    summary.heroSeeded = true;
  }

  if (!(await Contact.findOne())) {
    const payload = contactFromClient({
      email: defaultPortfolioContent.contact.email,
      whatsapp: defaultPortfolioContent.contact.whatsapp,
      linkedin: defaultPortfolioContent.contact.linkedin,
      github: defaultPortfolioContent.contact.github,
      phone: defaultPortfolioContent.contact.phone,
      heading: defaultPortfolioContent.contact.heading,
      description: defaultPortfolioContent.contact.description,
    });
    await Contact.findOneAndUpdate({}, payload, { upsert: true, new: true });
    summary.contactSeeded = true;
  }

  return summary;
}
