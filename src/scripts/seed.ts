import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

dotenv.config();

const seed = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing Users, Projects, and Tasks collections.");

    // Create Hashed Passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Users
    const adminUser = await User.create({
      Name: "Admin User",
      Email: "admin@example.com",
      Password: hashedPassword,
      Role: "Admin",
      isVerified: true,
    });

    const memberUser = await User.create({
      Name: "Member User",
      Email: "member@example.com",
      Password: hashedPassword,
      Role: "Member",
      isVerified: true,
    });

    console.log(`Created users: \n- Admin: ${adminUser.Email} \n- Member: ${memberUser.Email}`);

    // Create Projects
    const project1 = await Project.create({
      title: "Alpha Project",
      description: "This is the Alpha project containing core task items.",
      status: "active",
      owner: adminUser._id,
      members: [memberUser._id],
    });

    const project2 = await Project.create({
      title: "Beta Project",
      description: "This is the Beta project which is currently completed.",
      status: "completed",
      owner: adminUser._id,
      members: [],
    });

    console.log(`Created projects: \n- ${project1.title} \n- ${project2.title}`);

    // Create Tasks under Alpha Project
    const task1 = await Task.create({
      title: "Set up server infrastructure",
      description: "Configure MongoDB, Express API, and standard middlewares.",
      status: "Done",
      project: project1._id,
      Priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      assignee: adminUser._id,
    });

    const task2 = await Task.create({
      title: "Implement Auth Flow",
      description: "Write JWT authorization, bcrypt hashing, and OTP signups.",
      status: "in-progress",
      project: project1._id,
      Priority: "medium",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      assignee: memberUser._id,
    });

    const task3 = await Task.create({
      title: "Write documentation",
      description: "Add a complete README.md and sample Postman Collection.",
      status: "pending",
      project: project1._id,
      Priority: "low",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      assignee: null,
    });

    // Update project with task references
    project1.tasks.push(task1._id as mongoose.Types.ObjectId);
    project1.tasks.push(task2._id as mongoose.Types.ObjectId);
    project1.tasks.push(task3._id as mongoose.Types.ObjectId);
    await project1.save();

    console.log(`Created 3 tasks for project ${project1.title}`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
