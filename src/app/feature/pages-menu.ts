import { NbMenuItem } from '@nebular/theme';
import {CONFIG} from '../app.constant';

const marksChildren = [
  {
    title: 'Subject Division',
    link: CONFIG.ROUTES.MARKS + '/' + CONFIG.ROUTES.SUBJECT_DIVISION,
  },
  {
    title: 'Student Marks',
    link: CONFIG.ROUTES.MARKS + '/' + CONFIG.ROUTES.STUDENT_MARKS,
  },
  {
    title: 'Student Remarks',
    link: CONFIG.ROUTES.MARKS + '/' + CONFIG.ROUTES.STUDENT_REMARKS,
  },
  {
    title: 'Marks Card',
    link: CONFIG.ROUTES.MARKS + '/' + CONFIG.ROUTES.MARKS_CARD,
  },
]

const transportChildren = [
  {
    title: 'Buses',
    link: CONFIG.ROUTES.TRANSPORT + '/' + CONFIG.ROUTES.BUSES,
  },
  {
    title: 'Routes',
    link: CONFIG.ROUTES.TRANSPORT + '/' + CONFIG.ROUTES.ROUTES,
  },
]

const hallTicketsChildren = [
  {
    title: 'Setup',
    link: CONFIG.ROUTES.HALLTICKETS + '/' + CONFIG.ROUTES.HT_CONFIG,
  },
  {
    title: 'Students',
    link: CONFIG.ROUTES.HALLTICKETS + '/' + CONFIG.ROUTES.HT_STUDENTS,
  },
]

export const MENU_ITEMS = {
  'superadmin': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Institute Management',
      icon: 'nb-home',
      link: CONFIG.ROUTES.INSTITUTE,
      featureID: "DiGiF02"
    }
  ],
  'instituteadmin': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Institute profile',
      icon: 'nb-layout-default',
      link: CONFIG.ROUTES.INSTITUTE_PROFILE,
      featureID: "DiGiF02"
    },
    {
      title: 'School Management',
      icon: 'nb-home',
      link: CONFIG.ROUTES.SCHOOL_MGMT,
      featureID: "DiGiF03"
    },
    {
      title: 'Academics Setup',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.ACADEMIC_SETUP,
      featureID: "DiGiF04"
    },
  ],
  'schooladmin': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Academics Setup',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.ACADEMIC_SETUP,
      featureID: "DiGiF04"
    },
    {
      title: 'Staff Management',
      icon: 'nb-person',
      children: [
        {
          title: 'Teaching',
          link: CONFIG.ROUTES.STAFF + '/Yes',
        },
        {
          title: 'Non-Teaching',
          link: CONFIG.ROUTES.STAFF + '/No',
        },
      ],
      featureID: "DiGiF05"
    },
    {
      title: 'Student Management',
      icon: 'nb-person',
      link: CONFIG.ROUTES.STUDENT,
      featureID: "DiGiF06"
    },
    {
      title: 'Timeline',
      icon: 'nb-email',
      link: CONFIG.ROUTES.TIMELINE,
      featureID: "DiGiF07"
    },
    {
      title: 'Fee Management',
      icon: 'nb-compose',
      children: [
        {
          title: 'Collect Fee',
          link: CONFIG.ROUTES.FEE_MGMT + '/' +CONFIG.ROUTES.FEE_COLLECTIONS,
        },
        {
          title: 'Reports',
          link: CONFIG.ROUTES.FEE_MGMT + '/' +CONFIG.ROUTES.FEE_REPORTS,
        },
        {
          title: 'Assign Fee',
          link: CONFIG.ROUTES.FEE_MGMT + '/' +CONFIG.ROUTES.FEE_ASSIGNMENTS,
        },
        {
          title: 'Setup',
          link: CONFIG.ROUTES.FEE_MGMT + '/' +CONFIG.ROUTES.FEE_SETUP,
        }
      ],
      featureID: "DiGiF18"
    },
    {
      title: 'Bulk SMS',
      icon: 'nb-email',
      link: CONFIG.ROUTES.CUSTOM_SMS,
      featureID: "DiGiF08"
    },
    {
      title: 'Leave Management',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.LEAVE_MGMT,
      featureID: "DiGiF09"
    },
    {
      title: 'Attendance',
      icon: 'nb-compose',
      children: [
        {
          title: 'View Attendance',
          link: CONFIG.ROUTES.ATTENDANCE + '/view',
        },
        {
          title: 'Take Attendance',
          link: CONFIG.ROUTES.ATTENDANCE + '/take',
        },
      ],
      featureID: "DiGiF10"
    },
    {
      title: 'Gallery',
      icon: 'nb-grid-b-outline',
      link: CONFIG.ROUTES.GALLERY,
      featureID: "DiGiF11"
    },
    {
      title: 'News & Achievements',
      icon: 'nb-layout-two-column',
      link: CONFIG.ROUTES.ACHIEVEMENTS,
      featureID: "DiGiF12"
    },
    {
      title: 'Hall Tickets',
      icon: 'nb-compose',
      children: hallTicketsChildren,
      featureID: "DiGiF13"
    },
    {
      title: 'Marks',
      icon: 'nb-compose',
      children: marksChildren,
      featureID: "DiGiF14"
    },
    {
      title: 'Transport',
      icon: 'nb-layout-two-column',
      children: transportChildren,
      featureID: "DiGiF15"
    },
    {
      title: 'Reports',
      icon: 'nb-compose',
      children: [
        // {
        //   title: 'Fee reports',
        //   link: CONFIG.ROUTES.REPORTS + '/' +CONFIG.ROUTES.FEE_REPORT,
        // },
        {
          title: 'Attendance reports',
          link: CONFIG.ROUTES.REPORTS + '/' +CONFIG.ROUTES.ATTENDANCE_REPORT,
        },
        {
          title: 'Exam reports',
          link: CONFIG.ROUTES.REPORTS + '/' +CONFIG.ROUTES.MARKS_REPORT,
        }
      ],
      featureID: "DiGiF16"
    }
  ],
  'teachingstaff': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Timeline',
      icon: 'nb-email',
      link: CONFIG.ROUTES.TIMELINE,
      featureID: "DiGiF07"
    },
    {
      title: 'Leave Management',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.LEAVE_MGMT,
      featureID: "DiGiF09"
    },
    {
      title: 'Attendance',
      icon: 'nb-compose',
      children: [
        {
          title: 'View Attendance',
          link: CONFIG.ROUTES.ATTENDANCE + '/view',
        },
        {
          title: 'Take Attendance',
          link: CONFIG.ROUTES.ATTENDANCE + '/take',
        },
      ],
      featureID: "DiGiF10"
    },
    {
      title: 'Gallery',
      icon: 'nb-grid-b-outline',
      link: CONFIG.ROUTES.GALLERY,
      featureID: "DiGiF01"
    },
    {
      title: 'News & Achievements',
      icon: 'nb-layout-two-column',
      link: CONFIG.ROUTES.ACHIEVEMENTS,
      featureID: "DiGiF11"
    },
    {
      title: 'Marks',
      icon: 'nb-compose',
      children: marksChildren,
      featureID: "DiGiF12"
    }
  ],
  'nonteachingstaff': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Leave Management',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.LEAVE_MGMT,
      featureID: "DiGiF09"
    },
    {
      title: 'Gallery',
      icon: 'nb-grid-b-outline',
      link: CONFIG.ROUTES.GALLERY,
      featureID: "DiGiF11"
    },
    {
      title: 'News & Achievements',
      icon: 'nb-layout-two-column',
      link: CONFIG.ROUTES.ACHIEVEMENTS,
      featureID: "DiGiF12"
    },
   
  ],
  'parent': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
    {
      title: 'Timeline',
      icon: 'nb-email',
      link: CONFIG.ROUTES.TIMELINE,
      featureID: "DiGiF07"
    },
    {
      title: 'Leave Management',
      icon: 'nb-compose',
      link: CONFIG.ROUTES.LEAVE_MGMT,
      featureID: "DiGiF09"
    },
    {
      title: 'Gallery',
      icon: 'nb-grid-b-outline',
      link: CONFIG.ROUTES.GALLERY,
      featureID: "DiGiF11"
    },
    {
      title: 'News & Achievements',
      icon: 'nb-layout-two-column',
      link: CONFIG.ROUTES.ACHIEVEMENTS,
      featureID: "DiGiF12"
    },
    
  ],
  'default': [
    {
      title: 'Dashboard',
      icon: 'nb-bar-chart',
      link: CONFIG.ROUTES.DASHBOARD,
      home: true,
      featureID: "DiGiF01"
    },
  ],
};
