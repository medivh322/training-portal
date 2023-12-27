import { User } from '@modelsuser.model';
import express from 'express';
import mongoose from 'mongoose';

function env(name: string): string {
  return process.env[name] || `в .env нет ${name} значения`;
}

// type Roles = 'Admin' | 'User' | 'Aboba';

// const checkAccess = (accessRole?: Roles) => {
//   return async function (req: express.Request, res: express.Response, next: express.NextFunction) {
//     try {
//       const role = accessRole || req.body.accessRole;
//       const { userId, projectId } = req.body;
//       const access = await User.aggregate([
//         {
//           $match: { _id: new mongoose.Types.ObjectId(userId) },
//         },
//         {
//           $lookup: {
//             from: 'projects',
//             pipeline: [
//               {
//                 $match: { _id: new mongoose.Types.ObjectId(projectId) },
//               },
//               {
//                 $project: {
//                   _id: 0,
//                   access: {
//                     $in: [
//                       role,
//                       {
//                         $arrayElemAt: [
//                           {
//                             $map: {
//                               input: {
//                                 $filter: {
//                                   input: '$members',
//                                   as: 'member',
//                                   cond: {
//                                     $eq: ['$$member.user_id', new mongoose.Types.ObjectId(userId)],
//                                   },
//                                 },
//                               },
//                               as: 'filteredMember',
//                               in: '$$filteredMember.role',
//                             },
//                           },
//                           0,
//                         ],
//                       },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: 'matching_role',
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             isAccess: {
//               $arrayElemAt: ['$matching_role.access', 0],
//             },
//           },
//         },
//       ]);
//       if (!access[0].isAccess) {
//         return res.status(403).json({
//           success: false,
//         });
//       }
//       next();
//     } catch (error: any) {
//       res.status(500).json({
//         success: false,
//         error,
//       });
//     }
//   };
// };

export { env };
