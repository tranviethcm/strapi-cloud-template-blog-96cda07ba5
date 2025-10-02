import axios from 'axios';
import { parseStringPromise, Parser } from 'xml2js';
//URL gọi thực hiện API get Data từ API ngoài: http://localhost:1337/api/sap-users/sync
// Định nghĩa kiểu dữ liệu cho User từ API ngoài
interface ExternalUser {
  userID: string;
  User_Code: string;
  U_Name: string;
  E_mail: string | null;
  updateDate: string;
}

// Định nghĩa kiểu dữ liệu cho User trong Strapi
interface StrapiUser {
  userID: string;
  User_Code: string;
  U_Name: string;
  E_mail: string | null;
  updateDate: string;
  IsActive: boolean;
}

export default {
  async syncUsersFromExternalAPI(): Promise<string> {
    const apiUrl = 'http://192.168.1.38:6868/ExeSQL/ExecSelectSQL'; // Thay thế
    const apiParams = {
      clientUsername: 'tranvie', // Thay thế
      clientPassword: 'Nguoibinhxuyen@123', // Thay thế
      tableName: 'OUSR',
      fields: 'userID,User_Code,U_Name,E_mail,updateDate',
      hasWhere: true,
      whereClause: 'userID>0',
    };

    try {
      const response = await axios.get(apiUrl, {
        params: apiParams,
        // Cần thêm headers nếu API yêu cầu xác thực
      });

      //const parser = new Parser({ explicitArray: false, ignoreAttrs: true });
      //const result = await parseStringPromise(response.data, { parser }) as any;

      // SỬA ĐỔI DÒNG NÀY:
      const result = await parseStringPromise(response.data, {
        explicitArray: false,
        ignoreAttrs: true
      }) as any;
      console.log(JSON.stringify(result, null, 2)); // Log ra cấu trúc dữ liệu
      const usersData: ExternalUser[] = result['env:Envelope']['env:Body']['ExecuteSQLResponse']['BOM']['BO']['OUSR'].row;

      if (!usersData || usersData.length === 0) {
        return 'Không tìm thấy dữ liệu user.';
      }

      const processedUsers: StrapiUser[] = usersData.map(user => {
        const isActive = !user.U_Name.includes('Locked');
        return {
          userID: user.userID,
          User_Code: user.User_Code,
          U_Name: user.U_Name,
          E_mail: user.E_mail || null,
          updateDate: user.updateDate,
          IsActive: isActive,
        };
      });

      // for (const user of processedUsers) {
      //   const existingUser = await strapi.db.query('api::sap-user.sap-user').findOne({
      //     where: { user_id: user.userID },
      //   });

      //   if (existingUser) {
      //     await strapi.db.query('api::sap-user.sap-user').update({
      //       where: { id: existingUser.id },
      //       data: user,
      //     });
      //   } else {
      //     await strapi.db.query('api::sap-user.sap-user').create({
      //       data: user,
      //     });
      //   }
      // }

// for (const user of processedUsers) {
//         // SỬA DÒNG NÀY:
//         const existingUser = await strapi.db.query('api::sap-user.sap-user').findOne({
//           where: { user_id: user.userID },
//         });

//         if (existingUser) {
//           // SỬA DÒNG NÀY:
//           await strapi.db.query('api::sap-user.sap-user').update({
//             where: { id: existingUser.id },
//             // SỬA DÒNG NÀY:
//             data: {
//               user_id: user.userID,
//               user_code: user.User_Code,
//               u_name: user.U_Name,
//               e_mail: user.E_mail,
//               update_date: user.updateDate,
//               is_active: user.IsActive,
//             },
//           });
//         } else {
//           // SỬA DÒNG NÀY:
//           await strapi.db.query('api::sap-user.sap-user').create({
//             data: {
//               user_id: user.userID,
//               user_code: user.User_Code,
//               u_name: user.U_Name,
//               e_mail: user.E_mail,
//               update_date: user.updateDate,
//               is_active: user.IsActive,
//             },
//           });
//         }
//       }


    for (const user of processedUsers) {
      const existingUser = await strapi.db.query('api::sap-user.sap-user').findOne({
        // Tên trường trong mệnh đề 'where' phải là tên cột trong DB
        where: { user_id: user.userID }, 
      });

      // Tạo một đối tượng data mới để đảm bảo dữ liệu được định dạng chính xác
      const dataToSave = {
        userID: parseInt(user.userID), // Ép kiểu chuỗi thành số nguyên
        User_Code: user.User_Code,
        U_Name: user.U_Name,
        E_mail: user.E_mail || null,
        updateDate: user.updateDate,
        IsActive: user.IsActive,
        publishedAt: new Date(),
      };


      if (existingUser) {
        await strapi.db.query('api::sap-user.sap-user').update({
          where: { id: existingUser.id },
          // Truyền trực tiếp đối tượng 'user' đã xử lý
          data: dataToSave, 
        });
      } else {
        await strapi.db.query('api::sap-user.sap-user').create({
          // Truyền trực tiếp đối tượng 'user' đã xử lý
          data: dataToSave, 
        });
      }
    }
      

      return `Đồng bộ thành công ${processedUsers.length} người dùng.`;

    } catch (error) {
      console.error('Lỗi khi đồng bộ dữ liệu người dùng:', error.response ? error.response.data : error.message);
      throw new Error('Đã xảy ra lỗi khi đồng bộ dữ liệu.');
    }
  },
};