import React from 'react';
import {
  AllApzs as AdminAllApzs,
  ShowApz as AdminShowApz,
  UpdateApz as AdminUpdateApz,
  Admin,
  AddUsers
} from './admin';
import { Login, Register, EditPersonalData, EditPassword, ForgotPassword, ResetForm, FirstLogin } from './authorization';
import CitizenAllSketch from './sketch/citizen/AllSketch';
import CitizenShowSketch from './sketch/citizen/ShowSketch';
import CitizenAddSketch from './sketch/citizen/AddSketch';
import UrbanAllSketch from './sketch/urban/AllSketch';
import UrbanShowSketch from './sketch/urban/ShowSketch';
import BasePagePanel from './BasePagePanel';
import EngineerAllSketch from './sketch/engineer/AllSketch';
import EngineerShowSketch from './sketch/engineer/ShowSketch';
import HeadAllSketches from './sketch/head/AllSketches';
import HeadShowSketch from './sketch/head/ShowSketch';
import ExportToExcel from './apz/components/ExportToExcel';
import UrbanAllApzs from './apz/urban/AllApzs';
import UrbanShowApz from './apz/urban/ShowApz';
import { AllTemplates, AddTemplate, ShowTemplate } from './reject_templates';
import {
  AllApzs as EngineerAllApzs,
  ShowApz as EngineerShowApz,
  UpdateApz as EngineerEditApz
} from './apz/engineer';
import StateServicesAllApzs from './apz/state_services/AllApzs';
import StateServicesShowApz from './apz/state_services/ShowApz';
import HeadAllApzs from './apz/head/AllApzs';
import HeadShowApz from './apz/head/ShowApz';
import ProviderElectroAllApzs from './apz/provider_electro/AllApzs';
import ProviderElectroShowApz from './apz/provider_electro/ShowApz';
import ProviderGasAllApzs from './apz/provider_gas/AllApzs';
import ProviderGasShowApz from './apz/provider_gas/ShowApz';
import ProviderHeatAllApzs from './apz/provider_heat/AllApzs';
import ProviderHeatShowApz from './apz/provider_heat/ShowApz';
import ProviderPhoneAllApzs from './apz/provider_phone/AllApzs';
import ProviderPhoneShowApz from './apz/provider_phone/ShowApz';
import ProviderWaterAllApzs from './apz/provider_water/AllApzs';
import ProviderWaterShowApz from './apz/provider_water/ShowApz';

import OfficeAllApzs from './office/AllApzs';
import OfficeShowApz from './office/ShowApz';
import { AllFiles, Images } from './files';
import {
  AllApzs as CitizenAllApzs,
  AddApz as CitizenAddApz,
  ShowApz as CitizenShowApz
} from './apz/citizen';

import CitizenAllLandInLocality from './land_in_locality/citizen/AllLandInLocality';
import CitizenAddLandInLocality from './land_in_locality/citizen/AddLandInLocality';
import CitizenShowLandInLocality from './land_in_locality/citizen/ShowLandInLocality';
import UrbanAllLandInLocality from './land_in_locality/urban/AllLandInLocality';
import UrbanShowLandInLocality from './land_in_locality/urban/ShowLandInLocality';
import HeadAllLandInLocality from './land_in_locality/head/AllLandInLocality';
import HeadShowLandInLocality from './land_in_locality/head/ShowLandInLocality';
import AllLandInLocalityHistory from './land_in_locality/components/AllLandInLocalityHistory';

import CitizenAllPropertyAddress from './property_address/citizen/AllApplications';
import CitizenAddPropertyAddress from './property_address/citizen/AddApplication';
import CitizenShowPropertyAddress from './property_address/citizen/ShowApplication';
import UrbanAllPropertyAddress from './property_address/urban/AllApplications';
import UrbanShowPropertyAddress from './property_address/urban/ShowApplication';
import HeadAllPropertyAddress from './property_address/head/AllApplications';
import HeadShowPropertyAddress from './property_address/head/ShowApplication';
import AllPropertyAddressHistory from './property_address/components/AllApplicationsHistory';

import CitizenAllReligBuilding from './relig_building/citizen/AllApplications';
import CitizenAddReligBuilding from './relig_building/citizen/AddApplication';
import CitizenShowReligBuilding from './relig_building/citizen/ShowApplication';
import UrbanAllReligBuilding from './relig_building/urban/AllApplications';
import UrbanShowReligBuilding from './relig_building/urban/ShowApplication';
import HeadAllReligBuilding from './relig_building/head/AllApplications';
import HeadShowReligBuilding from './relig_building/head/ShowApplication';
import AllReligBuildingHistory from './relig_building/components/AllApplicationsHistory';

import CitizenAllReshapeToRelig from './reshape_to_relig/citizen/AllApplications';
import CitizenAddReshapeToRelig from './reshape_to_relig/citizen/AddApplication';
import CitizenShowReshapeToRelig from './reshape_to_relig/citizen/ShowApplication';
import UrbanAllReshapeToRelig from './reshape_to_relig/urban/AllApplications';
import UrbanShowReshapeToRelig from './reshape_to_relig/urban/ShowApplication';
import HeadAllReshapeToRelig from './reshape_to_relig/head/AllApplications';
import HeadShowReshapeToRelig from './reshape_to_relig/head/ShowApplication';
import AllReshapeToReligHistory from './reshape_to_relig/components/AllApplicationsHistory';

import CitizenAllPhotoReport from './photo_report/citizen/AllApplications';
import CitizenAddPhotoReport from './photo_report/citizen/AddApplication';
import CitizenShowPhotoReport from './photo_report/citizen/ShowApplication';
import UrbanAllPhotoReport from './photo_report/urban/AllApplications';
import UrbanShowPhotoReport from './photo_report/urban/ShowApplication';
import HeadAllPhotoReport from './photo_report/head/AllApplications';
import HeadShowPhotoReport from './photo_report/head/ShowApplication';
import AllPhotoReportHistory from './photo_report/components/AllApplicationsHistory';

import Actions from './Actions';
import LawyerAllApzs from './apz/lawyer/AllApzs';
import LawyerShowApz from './apz/lawyer/ShowApz';
import GenPlanAllApzs from './apz/gen_plan/AllApzs';
import GenPlanShowApz from './apz/gen_plan/ShowApz';
import GenPlanSchemeAllApzs from './apz/gen_plan_scheme/AllApzs';
import GenPlanSchemeShowApz from './apz/gen_plan_scheme/ShowApz';
import GenPlanHeadAllApzs from './apz/gen_plan_head/AllApzs';
import GenPlanHeadShowApz from './apz/gen_plan_head/ShowApz';
import GenPlanCalculationAllApzs from './apz/gen_plan_calculation/AllApzs';
import GenPlanCalculationShowApz from './apz/gen_plan_calculation/ShowApz';
import HeadStateServicesAllApzs from './apz/state_services_head/AllApzs';
import HeadStateServicesShowApz from './apz/state_services_head/ShowApz';
import SchemeRoadAllApzs from './apz/scheme_road/AllApzs';
import SchemeRoadShowApz from './apz/scheme_road/ShowApz';
import AllApzsHistory from './apz/components/AllApzsHistory';

const breadCrumbs = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  let fullLoc = window.location.href.split('/');
  let breadCrumbs = document.getElementById('breadCrumbs');
  breadCrumbs.innerHTML = '';
}

const routes = [

  {
    path: '/forgotPassword',
    render: (props) => <ForgotPassword {...props} />
  },
  {
    path: '/password/reset/:token',
    render: (props) => <ResetForm {...props} />
  },
  {
    path: '/editPersonalData',
    render: (props) => <EditPersonalData {...props} />
  },
  {
    path: '/editPassword',
    render: (props) => <EditPassword {...props} />
  },
  {
    path: '/login',
    render: (props) => <Login {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/register',
    render: (props) => <Register {...props} />
  },

  {
    path: '/panel/base-page',
    render: (props) => <BasePagePanel {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/files/all',
    exact: true,
    render: (props) => <AllFiles {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/files/images',
    exact: true,
    render: (props) => <Images {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/login',
    render: (props) => <Login {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/first_login',
    render: (props) => <FirstLogin {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/register',
    render: (props) => <Register {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/edit-personal-data',
    render: (props) => <EditPersonalData {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/edit-password',
    render: (props) => <EditPassword {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/common/export_to_excel',
    render: (props) => <ExportToExcel {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/apz/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllApzsHistory {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/services/:index',
    exact: true,
    render: (props) => <Actions {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/apz/status/:status/:page',
    exact: true,
    render: (props) => <CitizenAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/apz/add',
    exact: true,
    render: (props) => <CitizenAddApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/apz/edit/:id',
    exact: true,
    render: (props) => <CitizenAddApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/apz/show/:id',
    exact: true,
    render: (props) => <CitizenShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/sketch/status/:status/:page',
    render: (props) => <CitizenAllSketch {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/sketch/show/:id',
    exact: true,
    render: (props) => <CitizenShowSketch {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/sketch/add',
    exact: true,
    render: (props) => <CitizenAddSketch {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/sketch/edit/:id',
    exact: true,
    render: (props) => <CitizenAddSketch {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/admin/apz/status/:status/:page',
    exact: true,
    render: (props) => <AdminAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/admin/apz/show/:id',
    exact: true,
    render: (props) => <AdminShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/admin/apz/update/:id',
    exact: true,
    render: (props) => <AdminUpdateApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/admin/user-roles/:page',
    exact: true,
    render: (props) => <Admin {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/admin/users/add',
    render: (props) => <AddUsers {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/urban/apz/status/:status/:page',
    exact: true,
    render: (props) => <UrbanAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/apz/show/:id',
    exact: true,
    render: (props) => <UrbanShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/sketch/status/:status/:page',
    render: (props) => <UrbanAllSketch {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/sketch/show/:id',
    exact: true,
    render: (props) => <UrbanShowSketch {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/answer-template/all/:type/:page',
    exact: true,
    render: (props) => <AllTemplates {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/answer-template/:type/add',
    exact: true,
    render: (props) => <AddTemplate {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/answer-template/show/:type/:id',
    exact: true,
    render: (props) => <ShowTemplate {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/electro-provider/apz/status/:status/:page',
    exact: true,
    render: (props) => <ProviderElectroAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/electro-provider/apz/show/:id',
    exact: true,
    render: (props) => <ProviderElectroShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/gas-provider/apz/status/:status/:page',
    exact: true,
    render: (props) => <ProviderGasAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gas-provider/apz/show/:id',
    exact: true,
    render: (props) => <ProviderGasShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/heat-provider/apz/status/:status/:page',
    exact: true,
    render: (props) => <ProviderHeatAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/heat-provider/apz/show/:id',
    exact: true,
    render: (props) => <ProviderHeatShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/water-provider/apz/status/:status/:page',
    exact: true,
    render: (props) => <ProviderWaterAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/water-provider/apz/show/:id',
    exact: true,
    render: (props) => <ProviderWaterShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/phone-provider/apz/status/:status/:page',
    exact: true,
    render: (props) => <ProviderPhoneAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/phone-provider/apz/show/:id',
    exact: true,
    render: (props) => <ProviderPhoneShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/head/apz/status/:status/:page',
    exact: true,
    render: (props) => <HeadAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/apz/show/:id',
    exact: true,
    render: (props) => <HeadShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/sketch/status/:status/:page',
    render: (props) => <HeadAllSketches {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/sketch/show/:id',
    exact: true,
    render: (props) => <HeadShowSketch {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/office/apz/all/:page',
    exact: true,
    render: (props) => <OfficeAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/office/apz/show/:id',
    exact: true,
    render: (props) => <OfficeShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/lawyer/apz/status/:status/:page',
    exact: true,
    render: (props) => <LawyerAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/lawyer/apz/show/:id',
    exact: true,
    render: (props) => <LawyerShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/scheme_road/apz/status/:status/:page',
    exact: true,
    render: (props) => <SchemeRoadAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/scheme_road/apz/show/:id',
    exact: true,
    render: (props) => <SchemeRoadShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/engineer/apz/status/:status/:page',
    exact: true,
    render: (props) => <EngineerAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/engineer/apz/show/:id',
    exact: true,
    render: (props) => <EngineerShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/engineer/apz/edit/:id',
    exact: true,
    render: (props) => <EngineerEditApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/engineer/sketch/status/:status/:page',
    exact: true,
    render: (props) => <EngineerAllSketch {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/engineer/sketch/show/:id',
    exact: true,
    render: (props) => <EngineerShowSketch {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/state_services/apz/status/:status/:page',
    exact: true,
    render: (props) => <StateServicesAllApzs {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/state_services/apz/show/:id',
    exact: true,
    render: (props) => <StateServicesShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/gen_plan/apz/status/:status/:page',
    exact: true,
    render: (props) => <GenPlanAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan/apz/show/:id',
    exact: true,
    render: (props) => <GenPlanShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_head/apz/status/:status/:page',
    exact: true,
    render: (props) => <GenPlanHeadAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_head/apz/show/:id',
    exact: true,
    render: (props) => <GenPlanHeadShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_scheme/apz/status/:status/:page',
    exact: true,
    render: (props) => <GenPlanSchemeAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_scheme/apz/show/:id',
    exact: true,
    render: (props) => <GenPlanSchemeShowApz {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_calculation/apz/status/:status/:page',
    exact: true,
    render: (props) => <GenPlanCalculationAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/gen_plan_calculation/apz/show/:id',
    exact: true,
    render: (props) => <GenPlanCalculationShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/head_state_services/apz/status/:status/:page',
    exact: true,
    render: (props) => <HeadStateServicesAllApzs {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head_state_services/apz/show/:id',
    exact: true,
    render: (props) => <HeadStateServicesShowApz {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/landinlocality/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllLandInLocalityHistory {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/landinlocality/status/:status/:page',
    render: (props) => <CitizenAllLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/landinlocality/show/:id',
    exact: true,
    render: (props) => <CitizenShowLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/landinlocality/add',
    exact: true,
    render: (props) => <CitizenAddLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/landinlocality/edit/:id',
    exact: true,
    render: (props) => <CitizenAddLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/landinlocality/status/:status/:page',
    render: (props) => <UrbanAllLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/landinlocality/show/:id',
    exact: true,
    render: (props) => <UrbanShowLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/landinlocality/status/:status/:page',
    render: (props) => <HeadAllLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/landinlocality/show/:id',
    exact: true,
    render: (props) => <HeadShowLandInLocality {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/propertyaddress/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllPropertyAddressHistory {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/propertyaddress/status/:status/:page',
    render: (props) => <CitizenAllPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/propertyaddress/show/:id',
    exact: true,
    render: (props) => <CitizenShowPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/propertyaddress/add',
    exact: true,
    render: (props) => <CitizenAddPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/propertyaddress/edit/:id',
    exact: true,
    render: (props) => <CitizenAddPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/propertyaddress/status/:status/:page',
    render: (props) => <UrbanAllPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/propertyaddress/show/:id',
    exact: true,
    render: (props) => <UrbanShowPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/propertyaddress/status/:status/:page',
    render: (props) => <HeadAllPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/propertyaddress/show/:id',
    exact: true,
    render: (props) => <HeadShowPropertyAddress {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/religbuilding/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllReligBuildingHistory {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/religbuilding/status/:status/:page',
    render: (props) => <CitizenAllReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/religbuilding/show/:id',
    exact: true,
    render: (props) => <CitizenShowReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/religbuilding/add',
    exact: true,
    render: (props) => <CitizenAddReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/religbuilding/edit/:id',
    exact: true,
    render: (props) => <CitizenAddReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/religbuilding/status/:status/:page',
    render: (props) => <UrbanAllReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/religbuilding/show/:id',
    exact: true,
    render: (props) => <UrbanShowReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/religbuilding/status/:status/:page',
    render: (props) => <HeadAllReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/religbuilding/show/:id',
    exact: true,
    render: (props) => <HeadShowReligBuilding {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/reshapetorelig/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllReshapeToReligHistory {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/reshapetorelig/status/:status/:page',
    render: (props) => <CitizenAllReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/reshapetorelig/show/:id',
    exact: true,
    render: (props) => <CitizenShowReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/reshapetorelig/add',
    exact: true,
    render: (props) => <CitizenAddReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/reshapetorelig/edit/:id',
    exact: true,
    render: (props) => <CitizenAddReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/reshapetorelig/status/:status/:page',
    render: (props) => <UrbanAllReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/reshapetorelig/show/:id',
    exact: true,
    render: (props) => <UrbanShowReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/reshapetorelig/status/:status/:page',
    render: (props) => <HeadAllReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/reshapetorelig/show/:id',
    exact: true,
    render: (props) => <HeadShowReshapeToRelig {...props} breadCrumbs={breadCrumbs} />
  },

  {
    path: '/panel/photoreport/all_history/:user_id/:page',
    exact: true,
    render: (props) => <AllPhotoReportHistory {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/photoreport/status/:status/:page',
    render: (props) => <CitizenAllPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/photoreport/show/:id',
    exact: true,
    render: (props) => <CitizenShowPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/photoreport/add',
    exact: true,
    render: (props) => <CitizenAddPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/citizen/photoreport/edit/:id',
    exact: true,
    render: (props) => <CitizenAddPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/photoreport/status/:status/:page',
    render: (props) => <UrbanAllPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/urban/photoreport/show/:id',
    exact: true,
    render: (props) => <UrbanShowPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/photoreport/status/:status/:page',
    render: (props) => <HeadAllPhotoReport {...props} breadCrumbs={breadCrumbs} />
  },
  {
    path: '/panel/head/photoreport/show/:id',
    exact: true,
    render: (props) => <HeadShowPhotoReport {...props} breadCrumbs={breadCrumbs} />
  }
]

export { routes };