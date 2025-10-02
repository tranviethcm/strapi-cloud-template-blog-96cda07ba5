import axios from 'axios';
import { parseStringPromise, Parser } from 'xml2js';
//http://localhost:1337/api/activity/sync - Gọi API này để đồng bộ dữ liệu
// Định nghĩa kiểu dữ liệu cho Activity từ API ngoài
interface ExternalActivity {
  ClgCode: string;
  CardCode: string | null;
  Notes: string | null;
  CntctDate: string | null;
  CntctTime: string | null;
  Recontact: string | null;
  Closed: string | null;
  CloseDate: string | null;
  ContactPer: string | null;
  Tel: string | null;
  Fax: string | null;
  CntctSbjct: string | null;
  Transfered: string | null;
  DocType: string | null;
  DocNum: string | null;
  DocEntry: string | null;
  AttendUser: string | null;
  UserSign: string | null;
  SlpCode: string | null;
  Action: string | null;
  Details: string | null;
  CntctType: string | null;
  BeginTime: string | null;
  Duration: string | null;
  DurType: string | null;
  ENDTime: string | null;
  Priority: string | null;
  endDate: string | null;
  inactive: string | null;
  prevActvty: string | null;
  AssignedBy: string | null;
  AttendEmpl: string | null;
  UpdateDate: string | null;
  UserSign2: string | null;
  CreateDate: string | null;
  U_UserStatus: string | null;
  U_Evaluation: string | null;
  U_UserName: string | null;
  U_VBIB: string | null;
  U_Processing: string | null;
  U_AssignTo: string | null;
  U_Note: string | null;
}
// interface ExternalUser {
  // userID: string;
  // User_Code: string;
  // U_Name: string;
  // E_mail: string | null;
  // updateDate: string;
// }

// Định nghĩa kiểu dữ liệu cho User trong Strapi
interface StrapiActivity {
	card_code: string | null;
  clg_code: string | null;
	notes: string | null;
	closed: string | null;
	close_date: string | null;
	doc_entry: string | null;
	priority: string | null;
	details: string | null;
	duration: string | null;
	duration_type: string | null;
	doc_type: string | null;
	doc_num: string | null;
	fax: string | null;
	u_evaluation: string | null;
	u_user_status: string | null;
	u_vbib: string | null;
	u_processing: string | null;
	u_assign_to: string | null;
	u_note: string | null;
	session_id: string | null;
	cntct_date: string | null;
	cntct_time: string | null;
	recontact: string | null;
	tel: string | null;
	contact_person: string | null;
	cntct_sbjct: string | null;
  cntct_type: string | null;
	action: string | null;
	begin_time: string | null;
	end_time: string | null;
	end_date: string | null;
	inactive: string | null;
	prev_actvty: string | null;
	update_date: string | null;
  UserSign: string | null;
	UserSign2: string | null;
	CreateDate: string | null;
	U_UserStatus: string | null;
	U_Evaluation: string | null;
	U_UserName: string | null;
	U_VBIB: string | null;
	U_Processing: string | null;
	U_AssignTo: string | null;
    U_Note: string | null;
	HandledBy: string | null;
  AssignedBy: string | null;
  sales_employee: string | null;
  HandledByEmployee: string | null;
}

export default {
  async syncActivitiesFromExternalAPI(): Promise<string> {
    const apiUrl = 'http://192.168.1.38:6868/ExeSQL/ExecSelectSQL'; // Thay thế
    const apiParams = {
      clientUsername: 'tranvie', // Thay thế
      clientPassword: 'Nguoibinhxuyen@123', // Thay thế
      tableName: 'OCLG',
      fields: 'ClgCode,CardCode,Notes,CntctDate,CntctTime,Recontact,Closed,CloseDate,ContactPer,Tel,Fax,CntctSbjct,Transfered,DocType,DocNum,DocEntry,AttendUser,UserSign,SlpCode,Action,Details,CntctType,BeginTime,Duration,DurType,ENDTime,Priority,endDate,inactive,prevActvty,AssignedBy,AttendEmpl,UpdateDate,UserSign2,CreateDate,U_UserStatus,U_Evaluation,U_UserName,U_VBIB,U_Processing,U_AssignTo,U_Note',
      hasWhere: true,
      whereClause: 'ClgCode>0',
    };

    try {
      const response = await axios.get(apiUrl, {
        params: apiParams,
        // Cần thêm headers nếu API yêu cầu xác thực
      });

      // SỬA ĐỔI DÒNG NÀY:
      const result = await parseStringPromise(response.data, {
        explicitArray: false,
        ignoreAttrs: true
      }) as any;
      //console.log(JSON.stringify(result, null, 2)); // Log ra cấu trúc dữ liệu
      const activityData: ExternalActivity[] = result['env:Envelope']['env:Body']['ExecuteSQLResponse']['BOM']['BO']['OCLG'].row;
  
      if (!activityData || activityData.length === 0) {
        return 'Không tìm thấy dữ liệu activity.';
      }

      const processedActivities: StrapiActivity[] = activityData.map(activity => {
       // const isActive = !activity.U_Name.includes('Locked');
        return {
          clg_code: activity.ClgCode ?? null,
          card_code: activity.CardCode ?? null,
          notes: activity.Notes ?? null,
          closed: activity.Closed ?? null,
          close_date: activity.CloseDate ?? null,
          doc_entry: activity.DocEntry ?? null,
          priority: activity.Priority ?? null,
          details: activity.Details ?? null,
          duration: activity.Duration ?? null,
          duration_type: activity.DurType ?? null,
          doc_type: activity.DocType ?? null,
          doc_num: activity.DocNum ?? null,
          fax: activity.Fax ?? null,
          u_evaluation: activity.U_Evaluation ?? null,
          u_user_status: activity.U_UserStatus ?? null,
          u_vbib: activity.U_VBIB ?? null,
          u_processing: activity.U_Processing ?? null,
          u_assign_to: activity.U_AssignTo ?? null,
          u_note: activity.U_Note ?? null,
          session_id: null,
          cntct_date: activity.CntctDate ?? null,
          cntct_time: activity.CntctTime ?? null,
          recontact: activity.Recontact ?? null,
          tel: activity.Tel ?? null,
          contact_person: activity.ContactPer ?? null,
          cntct_sbjct: activity.CntctSbjct ?? null,
          action: activity.Action ?? null,
          begin_time: activity.BeginTime ?? null,
          end_time: activity.ENDTime ?? null,
          end_date: activity.endDate ?? null,
          inactive: activity.inactive ?? null,
          prev_actvty: activity.prevActvty ?? null,
          update_date: activity.UpdateDate ?? null,
          UserSign2: activity.UserSign2 ?? null,
          CreateDate: activity.CreateDate ?? null,
          U_UserStatus: activity.U_UserStatus ?? null,
          U_Evaluation: activity.U_Evaluation ?? null,
          U_UserName: activity.U_UserName ?? null,
          U_VBIB: activity.U_VBIB ?? null,
          U_Processing: activity.U_Processing ?? null,
          U_AssignTo: activity.U_AssignTo ?? null,
          U_Note: activity.U_Note ?? null,
          UserSign: activity.UserSign ?? null,
          cntct_type: activity.CntctType ?? null,
          HandledBy: activity.AttendUser ?? null,
          AssignedBy: activity.AssignedBy ?? null,
          sales_employee: activity.SlpCode ?? null,
          HandledByEmployee: activity.AttendEmpl?? null,

        };
      });

    
    for (const activity of processedActivities) {
      const existingActivity = await strapi.db.query('api::activity.activity').findOne({
        where: { clg_code: activity.clg_code }, 
      });

      // Tạo một đối tượng data mới để đảm bảo dữ liệu được định dạng chính xác
      const dataToSave = {
        ClgCode:activity.clg_code,
        CardCode:activity.card_code,
        Notes:activity.notes,
        Closed:activity.closed,
        CloseDate:activity.close_date,
        DocEntry:activity.doc_entry,
        Priority:activity.priority,
			  Details:activity.details,
			  Duration:activity.duration,
			  DurationType:activity.duration_type,
        DocType:activity.doc_type,
        DocNum:activity.doc_num,
        Fax:activity.fax,
        U_Evaluation:activity.u_evaluation,
        U_UserStatus:activity.u_user_status,
        U_VBIB:activity.u_vbib,
        U_Processing:activity.U_Processing,
        U_AssignTo:activity.U_AssignTo,
        U_Note:activity.U_Note,
        //clg_code:parseInt(activity.clg_code),
        CntctDate:activity.cntct_date,
        CntctTime:activity.cntct_time,
        Recontact:activity.recontact,
        Tel:activity.tel,
        ContactPerson:activity.contact_person,
        CntctSbjct:activity.cntct_sbjct,
        Action:activity.action,
        BeginTime:activity.begin_time,
        ENDTime:activity.end_time,
        endDate:activity.end_date,
        inactive:activity.inactive,
        prevActvty:activity.prev_actvty,
        UpdateDate:activity.update_date,
			  activity_type:activity.cntct_type,
			  UserSign:activity.UserSign,
        HandledBy:activity.HandledBy,
        AssignedBy:activity.AssignedBy,
        sales_employee:activity.sales_employee,
      	HandledByEmployee:activity.HandledByEmployee,
			  UserSign2:activity.UserSign2,
			  publishedAt: new Date(),
        //ActivityRecipients: activity.

      };
      //console.log(JSON.stringify("UserSign2: "+dataToSave.UserSign2 +", UserSign: "+dataToSave.UserSign, null, 2)); 
      const finalPayload: any = { ...dataToSave };

     // Xử lý các trường có thể có giá trị null hoặc "0" để tránh lỗi khóa ngoại
      if (finalPayload.UserSign2 === null || finalPayload.UserSign2 === "0") {
       delete finalPayload.UserSign2;
        //console.log(JSON.stringify("UserSign2: "+ finalPayload.UserSign2 +", UserSign: "+finalPayload.UserSign, null, 2)); 
     }
    if (finalPayload.HandledByEmployee === null || finalPayload.HandledByEmployee === "0") {
       delete finalPayload.HandledByEmployee;
     }
     if (finalPayload.sales_employee === null || finalPayload.sales_employee === "0"|| finalPayload.sales_employee === "-1") {
       delete finalPayload.sales_employee;
     }
     if (finalPayload.UserSign === null || finalPayload.UserSign === "0") {
       delete finalPayload.UserSign;
    }
     if (finalPayload.AssignedBy === null || finalPayload.AssignedBy === "0") {
       delete finalPayload.AssignedBy;
     }
     if (finalPayload.HandledBy === null || finalPayload.HandledBy === "0") {
       delete finalPayload.HandledBy;
     }

		/*
		    // Tìm kiếm các bản ghi SAPUser để lấy ID
        const assignToUser = await strapi.db.query('api::sap-user.sap-user').findOne({
          where: { user_code: activity.U_AssignTo }
        });
        if (assignToUser) {
          dataToSave.U_AssignTo = assignToUser.id;
        }

        const userSignUser = await strapi.db.query('api::sap-user.sap-user').findOne({
          where: { user_code: activity.UserSign }
        });
        if (userSignUser) {
          dataToSave.UserSign = userSignUser.id;
        }

        const attendEmplUser = await strapi.db.query('api::sap-user.sap-user').findOne({
          where: { user_code: activity.AttendEmpl }
        });
        if (attendEmplUser) {
          dataToSave.AttendEmpl = attendEmplUser.id;
        }

        const assignedByUser = await strapi.db.query('api::sap-user.sap-user').findOne({
          where: { user_code: activity.AssignedBy }
        });
        if (assignedByUser) {
          dataToSave.AssignedBy = assignedByUser.id;
        }

        const existingActivity = await strapi.db.query('api::activity.activity').findOne({
          where: { ClgCode: dataToSave.ClgCode },
        });

        if (existingActivity) {
          await strapi.db.query('api::activity.activity').update({
            where: { id: existingActivity.id },
            data: dataToSave,
          });
        } else {
          await strapi.db.query('api::activity.activity').create({
            data: dataToSave,
          });
        }
		*/

      if (existingActivity) {
        //console.log(JSON.stringify("Ton tai clgCode: " + existingActivity, null, 2)); // Log ra dữ liệu activity
        await strapi.db.query('api::activity.activity').update({
          where: { id: existingActivity.id },
          // Truyền trực tiếp đối tượng 'Activity' đã xử lý cho update
          data: finalPayload, 
        });
      } else {
        ////console.log(JSON.stringify("Tao New: " + dataToSave.ClgCode, null, 2)); // Log ra dữ liệu activity

        await strapi.db.query('api::activity.activity').create({
          // Truyền trực tiếp đối tượng 'Activity' đã xử lý để tạo mới
          data: finalPayload, 
        });
      }
    }
      

      return `Đồng bộ thành công ${processedActivities.length} hoạt động.`;

    } catch (error) {
      console.error('Lỗi khi đồng bộ dữ liệu hoạt động:', error.response ? error.response.data : error.message);
      throw new Error('Đã xảy ra lỗi khi đồng bộ dữ liệu.');
    }
  },
};