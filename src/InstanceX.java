//package com.dlcdashboard.util;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.File;
import java.util.Arrays;
import java.util.ArrayList;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DecimalFormat;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClient;
import com.amazonaws.services.identitymanagement.model.User;
import com.amazonaws.services.identitymanagement.model.Group;
import com.amazonaws.services.identitymanagement.model.Role;
import com.amazonaws.services.identitymanagement.model.ListUsersResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsResult;
import com.amazonaws.services.identitymanagement.model.GetGroupRequest;
import com.amazonaws.services.identitymanagement.model.ListRolesResult;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserRequest;
import com.amazonaws.services.identitymanagement.model.ListGroupsForUserResult;
import com.amazonaws.services.ec2.model.InstanceBlockDeviceMapping;
import com.amazonaws.services.ec2.model.EbsInstanceBlockDevice;
import com.amazonaws.services.sqs.model.GetQueueAttributesResult;
import com.amazonaws.services.ec2.model.SecurityGroup;
import com.amazonaws.services.ec2.model.IpPermission;
import com.amazonaws.services.ec2.model.DescribeInstancesResult;
import com.amazonaws.services.ec2.model.DescribeVolumesResult;
import com.amazonaws.services.ec2.model.DescribeVolumesRequest;
import com.amazonaws.services.ec2.model.Volume;
import com.amazonaws.services.ec2.model.DescribeImagesRequest;
import com.amazonaws.services.ec2.model.DescribeImagesResult;
import com.amazonaws.services.ec2.model.Image;
import com.amazonaws.services.ec2.model.DescribeInstancesRequest;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.Reservation;
import com.amazonaws.services.ec2.model.Tag;
import com.amazonaws.services.ec2.model.Filter;
import com.amazonaws.services.ec2.model.Placement;
import com.amazonaws.services.ec2.model.GroupIdentifier;
import com.amazonaws.services.ec2.model.DescribeVolumesRequest;

import com.amazonaws.services.ec2.AmazonEC2Client;
import com.amazonaws.services.sqs.AmazonSQSClient;
import com.amazonaws.regions.Regions;   // Enum
import com.amazonaws.regions.Region;    // Class with the methods
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClient;
import com.amazonaws.services.cloudwatch.model.Datapoint;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsResult;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsRequest;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.sqs.model.ListQueuesResult;
import com.amazonaws.services.ec2.model.DescribeInstanceStatusResult;
import com.amazonaws.services.ec2.model.DescribeInstanceStatusRequest;
import com.amazonaws.services.ec2.model.InstanceStatus;
import com.amazonaws.services.ec2.model.InstanceStatusEvent;
import com.amazonaws.services.ec2.model.StartInstancesRequest;
import com.amazonaws.services.ec2.model.StartInstancesResult;
import com.amazonaws.services.ec2.model.StopInstancesRequest;
import com.amazonaws.services.ec2.model.StopInstancesResult;
import com.amazonaws.services.ec2.model.DescribeSecurityGroupsRequest;
import com.amazonaws.services.ec2.model.DescribeSecurityGroupsResult;
import org.joda.time.*;
public class InstanceX {
     private  DLCUtil dlcutil = new DLCUtil();
     Instance instance;
     String   Id;
     String   env;
     String   mappedenv;
     String   name;
     String   tag;
     String   owner;
     String   ownerfiltered;
     String   purpose;
     String   region;
     String   sg;
     String   securityGroupName;
     String   subnet;
     String   ami;
     String   envreg;
     String   launch;
     DateTime jodadatetimelaunch;
     DateTime jodadatetimenow;
     DateTime jodadatetimeyesterday;
     long     launchdeltahours;
     long     launchdeltadays;
     String   instancetype;
     String   vpcId;
     String   volumes;
     String   devices;
     String   devicevolumes;
     String   privatedns;
     String   publicdns;
     String   ipprivate;
     String   ippublic;
     String   keyName;
     String   placementGroup;
     int      stateCode;
     int      storage;
     double   storageCost;
     String   AvailabilityZone;
     String   AZ;
     String   cpuMetricUrl;
     String   netinMetricUrl;
     String   netoutMetricUrl;
     String   status;
     String   launchtimestring;
     String   price;
     String   price24;
     String   price30DayMonth;
     Double   price30DayMonthDouble;
     String   ipPermissions;
     String   events;
     int      volumesize;
     double   cost;
     MyTimeStamp  launchtimestamp;
     Date     launchdate;
     String   monitoringState;

     List<String> unitStorageList = new ArrayList<String>();
     List<String> unitCostStorageList = new ArrayList<String>();
     List<String> volumeList = new ArrayList<String>();
     List<String> deviceList = new ArrayList<String>();
     List<String> devicevolumeList = new ArrayList<String>();
     List<String> deviceIdList = new ArrayList<String>();
     List<String> deviceStatusList = new ArrayList<String>();
     List<String> deviceSummaryList = new ArrayList<String>(); 
    public static int volumeDataFlag = 0; 
    public InstanceX() {
    }
    public InstanceX(DLCConnect cn, String env, String region, String id) {
         Instance instance = getInstanceById(cn, env,region, id);
         initInstanceX(cn, env, region, instance, "");
    }
    public InstanceX(DLCConnect cn, String env, String region, Instance instance) {
         initInstanceX(cn, env, region, instance, "");
    }

    public InstanceX(DLCConnect cn, String env, String region, String id, String detailMode) {
         Instance instance = getInstanceById(cn, env,region, id);
         initInstanceX(cn, env, region, instance, detailMode);
    }
    public InstanceX(DLCConnect cn, String env, String region, Instance instance,String detailMode) {
         initInstanceX(cn, env, region, instance, detailMode);
    }

    private  void initInstanceX(DLCConnect cn, String env, String region, Instance instance, String detailMode) {
         // MyTimeStamp myts= new MyTimeStamp();
         // u.syscatln(myts.markTime());
         String sz="";
         String ddlim="";
         this.instance  = instance;
         this.region    = region;
         this.env       = env;
         sz = Custom.nameToChar(env);
         this.mappedenv = sz;
         this.envreg    = sz+this.region;
         this.stateCode = instance.getState().getCode();
         this.monitoringState = instance.getMonitoring().getState();


         this.AZ                    = this.instance.getPlacement().getAvailabilityZone();
         this.AvailabilityZone      = this.instance.getPlacement().getAvailabilityZone();
         this.Id        = this.instance.getInstanceId();
         this.keyName   = this.instance.getKeyName();
         this.cpuMetricUrl = getServiceUrl(this.env,"cpumulti",this.instance.getInstanceId(),this.region,1,18);
         this.netinMetricUrl = getServiceUrl(this.env,"netin",this.instance.getInstanceId(),this.region,1,18);
         this.netoutMetricUrl = getServiceUrl(this.env,"netout",this.instance.getInstanceId(),this.region,1,18);
         this.storage=0;
         this.storageCost=0;


         // http://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/ec2/model/InstanceStatus.html
         this.events = "not set";
         // THIS TAKE ALOT OF TIME
         // THIS SLOWS SLOWS SLOWS THE LIST RETURN DOWN
         // MAJOR TIME CYCLES SPENT HERE!
         if ( 1 == 0 ) {
         DescribeInstanceStatusRequest instanceStatusReq = new DescribeInstanceStatusRequest();
         List<String> ll = Arrays.asList(this.Id);
         instanceStatusReq.setInstanceIds(ll);
         DescribeInstanceStatusResult instanceStatusResult = cn.ConnectEC2(env,region).describeInstanceStatus(instanceStatusReq);
         List<InstanceStatus>  instanceStatusList = instanceStatusResult.getInstanceStatuses();
         for (InstanceStatus isl:instanceStatusList) {
              List <InstanceStatusEvent> eventList = isl.getEvents();
              for (InstanceStatusEvent ise:eventList)
                                 this.events = this.events + ise.getDescription(); 
         }
         }


         this.volumes="";
         this.devices="";
         this.devicevolumes="";

         // Secondary Method

         MyTimeStamp myts= new MyTimeStamp();

         for (InstanceBlockDeviceMapping bdm:this.instance.getBlockDeviceMappings()) {
              this.deviceList.add( bdm.getDeviceName() );
              this.volumeList.add( bdm.getEbs().getVolumeId() );
              this.volumesize = this.volumesize + Cache.getSizeInteger(bdm.getEbs().getVolumeId());
              this.devicevolumeList.add( 
                                         bdm.getDeviceName() + ":" 
                                         + bdm.getEbs().getVolumeId() + ":"
                                         + Cache.getSize(bdm.getEbs().getVolumeId())
                                         + "<br>" );
         }


         this.storageCost = new Double( this.volumesize * 0.125);



         this.volumes=listToString(this.volumeList," ").replaceAll("vol-","");
         this.devices=listToString(this.deviceList," ").replaceAll("/dev/","");
         this.devicevolumes=listToString(this.devicevolumeList," ").replaceAll("/dev/","").replaceAll("vol-","");
         //
         //
         //  USEFUL LINK:   http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
         // This take more time to perform
         //if ( detailMode.equals("storage") ) {
         if ( 1 == getVolumeDataFlag() ) {
              List <InstanceBlockDeviceMapping> list = this.instance.getBlockDeviceMappings();
         // for (InstanceBlockDeviceMapping bdm:list) u.syscatln(bdm.toString()); 
              for (InstanceBlockDeviceMapping bdm:list) {
                   this.deviceList.add( bdm.getDeviceName() );
                   this.volumeList.add( bdm.getEbs().getVolumeId() );
              }
              this.volumes=listToString(this.volumeList," ").replaceAll("vol-","");
              this.devices=listToString(this.deviceList," ").replaceAll("/dev/","");
              for (InstanceBlockDeviceMapping bdm:list) {
                   DescribeVolumesRequest req = new DescribeVolumesRequest();
                   List <String> l = new ArrayList<String>();
                   this.deviceIdList.add(bdm.getEbs().getVolumeId());
                   l.add(bdm.getEbs().getVolumeId());
                   req.setVolumeIds(l);
                   List<Volume> v=cn.ConnectEC2(env,region).describeVolumes(req).getVolumes();
                   for (Volume vol:v) {
                        this.storage = this.storage + vol.getSize();
                        // this.storageCost = this.storageCost + (vol.getSize() * 0.125);
                        this.unitStorageList.add(vol.getSize().toString());
                        Double d = new Double(vol.getSize()*0.125);
                        //this.unitcostStorageList.add(vol.getSize().toString());
                        this.unitCostStorageList.add(d.toString());
                   }
                   this.deviceStatusList.add( bdm.getEbs().getStatus() );
                   this.deviceSummaryList.add( bdm.getDeviceName() + " " + bdm.getEbs().getVolumeId()); 
                   //+ " " + bdm.getEbs().getStatus());
              }
         }

         // DescribeInstanceStatusRequest req = new DescribeInstanceStatusRequest().withInstanceIds(instance.getInstanceId());
         // DescribeInstanceStatusResult res = (new DLCConnect()).ConnectEC2(env,region).describeInstanceStatus(req);
         // List<InstanceStatus> state = res.getInstanceStatuses();
         // this.status = state.get(0).getInstanceState().getName();
         // List <Tag> t1 =instance.getTags();
         this.status = mapInstanceState(instance.getState().getName());
         this.name="-";
         this.purpose="-";
         this.tag="-";
         this.owner="-";
         this.ownerfiltered="-";
         this.sg="-";
         this.securityGroupName="-";
         this.subnet="-";
         this.ami="-";
         this.vpcId="-";

         Map<String, String>     tagmap  = new HashMap<String, String>(64);
         for (Tag teg:instance.getTags()) tagmap.put(teg.getKey(), teg.getValue());
         this.owner   = Helper.getKeyMap(tagmap,"Owner","-").toLowerCase();
         this.name    = Helper.getKeyMap(tagmap,"Name","-").toLowerCase();
         this.purpose = Helper.getKeyMap(tagmap,"Purpose","-").toLowerCase();
         this.tag     = Helper.getKeyMap(tagmap,Custom.getTagNameString(),"-");
         this.ownerfiltered = this.owner.replaceAll("[AaEeIiOoUuYy]","");

         List <GroupIdentifier> g1 =instance.getSecurityGroups();
         for (GroupIdentifier sgg:g1)  this.sg = sgg.getGroupId();
         for (GroupIdentifier sgg:g1)  this.securityGroupName = sgg.getGroupName();
         this.ipPermissions = getSecurityGroupRules(cn, this.env, this.region, this.sg);
         this.placementGroup = nonull(instance.getPlacement().getGroupName());
         this.subnet = nonull(instance.getSubnetId());
         this.ami = nonull(instance.getImageId());
         this.vpcId = nonull(instance.getVpcId());
         
         // getLaunchTime returns java.util.Date
         this.launchdate = instance.getLaunchTime();
         // from JDK to Joda
         this.jodadatetimelaunch = new DateTime(this.launchdate);
         this.jodadatetimenow = new DateTime();
         this.jodadatetimeyesterday = (new DateTime()).minusHours(48);
         Duration duration = new Duration(this.jodadatetimelaunch, this.jodadatetimenow);
         Interval interval = new Interval(this.jodadatetimeyesterday, this.jodadatetimenow);
         this.launchdeltahours = duration.getStandardHours();
         this.launchdeltadays = duration.getStandardDays();
//OTTO




         // u.syscatln("LaunchTime : " + this.jodadatetimelaunch.toString());
         // u.syscatln("NowTime    : " + this.jodadatetimenow.toString());
         // u.syscatln("Delta Hrs  : " + Long.toString( this.launchdeltahours ) );
         // u.syscatln("Delta Days : " + Long.toString( this.launchdeltadays ) );


         // u.syscatln("Delta Days    " + duration.getStandardDays());
         // u.syscatln("Delta Minutes " + duration.getStandardMinutes());
         // u.syscatln( interval.contains(this.jodadatetimelaunch) );
         // int minutes = p.getMinutes();
         //DateTime test = new DateTime(2010, 5, 25, 16, 0, 0, 0);

         this.launchtimestamp = new MyTimeStamp(this.launchdate);
         this.launchtimestring = this.launchtimestamp.value();
         this.instancetype = nonull(instance.getInstanceType());
         this.ipprivate = nonull(instance.getPrivateIpAddress());
         this.ippublic = nonull(instance.getPublicIpAddress());
         this.privatedns = nonull(instance.getPrivateDnsName());
         this.publicdns = nonull(instance.getPublicDnsName());

         this.price           = Cache.getPrice(this.instancetype);
         this.price24         = Cache.getPrice24(this.instancetype);
         this.price30DayMonth = Cache.getPrice30DayMonth(this.instancetype);
         this.price30DayMonthDouble = Cache.getPrice30DayMonthDouble(this.instancetype);
         this.cost                  = Double.parseDouble(this.price24);

         // u.syscatln(myts.markTime());
     }
     public int startInstance() throws AmazonServiceException, AmazonClientException, InterruptedException {
          DLCConnect conn = new DLCConnect();
          StartInstancesRequest startRequest = new StartInstancesRequest().withInstanceIds(this.Id);
          StartInstancesResult startResult = conn.ConnectEC2(this.env,this.region).startInstances(startRequest);
          return 0;
     }
     public int stopInstance() throws AmazonServiceException, AmazonClientException, InterruptedException {
          DLCConnect conn = new DLCConnect();
          StopInstancesRequest stopRequest = new StopInstancesRequest().withInstanceIds(this.Id);
          StopInstancesResult  stopResult = conn.ConnectEC2(this.env,this.region).stopInstances(stopRequest);
          return 0;
     }

     public String   getSummary() {
          String c = ",";
          StringBuilder sb = new StringBuilder();
          sb.append(this.getEnv()).append(c);
          sb.append(this.getId());
          return sb.toString(); 
     }
     public String   getEventsJson()      { return json(this.events); }
     public String   getIpPrivate()          { return this.ipprivate; }
     public String   getIpPrivateJson()      { return json(this.ipprivate); }
     public String   setIpPrivate(String sz) { return this.ipprivate=sz;}
     
     public String   getSsh()               { return "ssh -i ~/PEMS/" + this.keyName + ".pem ec2-user@" + this.publicdns; }
     public String   getSshJson()           { return json("ssh -i ~/PEMS/" + this.keyName + ".pem ec2-user@" + this.publicdns); }

     public String   getIpPublic()          { return this.ippublic; }
     public String   getIpPublicJson()      { return json(this.ippublic); }
     public String   setIpPublic(String sz) { return this.ippublic=sz;}

     public String   getVpcId()             { return this.vpcId.replace("vpc-",""); }
     public String   getVpcIdJson()         { return json(this.vpcId.replace("vpc-","")); }
     public String   setVpcId(String sz)    { return this.vpcId=sz;}

     public String   getVolumes()           { return this.volumes; }
     public String   getVolumesJson()       { return json(this.volumes); }
     public String   setVolumes(String sz)  { return this.volumes=sz;}

     public String   getMonitoringState()           { return this.monitoringState; }
     public String   getMonitoringStateJson()       { return json(this.monitoringState); }

     public String   getPlacementGroupJson() { return json(this.placementGroup); } 

     public String   getKeyName()           { return this.keyName; } 
     public String   getKeyPairName()       { return this.keyName; } 
     public String   getKeyPair()           { return this.keyName; } 
     public String   getKeyNameJson()       { return json(this.keyName); } 
     public String   getKeyPairNameJson()   { return json(this.keyName); } 
     public String   getKeyPairJson()       { return json(this.keyName); } 

     public String   getIpPermissions()     { return this.ipPermissions; }
     public String   getIpPermissionsJson() { return json(this.ipPermissions); }

     public String   getDevices()           { return this.devices; }
     public String   getDeviceVolumes()     { return this.devicevolumes; }
     public String   getDevicesJson()       { return json(this.devices); }
     public String   getDeviceVolumesJson() { return json(this.devicevolumes); }
     public String   setDevices(String sz)  { return this.devices=sz;}
    
     public String   getTs()                { return this.launchtimestring; }
     public String   getTsJson()            { return json(this.launchtimestring); }
     public String   getLaunchDate()        { return this.launchtimestring.replace("-","/"); }
     public String   getLaunchDateJson()    { return json(getLaunchDate()); }
     public String   getLaunchDateExtendedJson()    { return json(this.launchtimestring); }
     
     public String   getLaunchDeltaHours()     { return Long.toString(this.launchdeltahours); }
     public String   getLaunchDeltaHoursJson() { return json(getLaunchDeltaHours()); }
     public String   getLaunchDeltaDays()      { return Long.toString(this.launchdeltadays); }
     public String   getLaunchDeltaDaysJson()  { return json(getLaunchDeltaDays()); }
     public String   getMEMCount()             { return getMEMCountString(this.instancetype); }
     public String   getCPUCount()             { return getCPUCountString(this.instancetype); }
     public String   getInstanceBOM()          { 
          return Cache.getInstanceConfig(this.instancetype);
     }
     public String   getInstanceBOMJson()      { return json( getInstanceBOM() ); }
     public String   getInstanceCPUCount()     { return getCPUCountString(this.instancetype); }
     public String   getInstanceCPUCountJson() { return json(getCPUCountString(this.instancetype)); }




     private String  mapInstanceType(String t)      { 
          String  sz = t;
          sz = sz.replace("medium","md"); 
          sz = sz.replace("xlarge","xl"); 
          sz = sz.replace("large","l"); 
          sz = sz.replace("micro","mc"); 
          return(sz);
     }
     public String   getInstanceType()              { return mapInstanceType(this.instancetype); }
     public String   getInstanceTypeJson()          { return json(mapInstanceType(this.instancetype)); }
     public String   getInstanceTypeFull()          { return this.instancetype; }
     public String   getInstanceTypeFullJson()      { return json(this.instancetype); }
     public String   getInstanceTypeRawJson()       { return json(this.instancetype); }
     public String   getInstanceTypeRaw()           { return this.instancetype; }
     public String   setInstanceType(String sz)     { return this.instancetype=sz;}

     public String   getPrice()             { return this.price; }
     public String   getPriceJson()         { return json(this.price); }
     public String   getPrice24()           { return this.price24; }
     public String   getPrice24Json()       { return json(this.price24); }
     public String   setPrice24(String sz)  { return this.price24=sz;}
     
     public String   getPrice30DayMonth()     { return this.price30DayMonth; }
     public String   getPrice30DayMonthJson() { return json(this.price30DayMonth); }

     public Double   getCost()              { return this.cost; }
     
     public String   getEnvId()             { return this.env+","+this.Id; }
     public String   getEnvIdJson()         { return json(this.env+","+this.Id); }

     public String   getEnvRegId()          { return this.env+","+this.region+","+this.Id; }
     public String   getEnvRegIdJson()      { return json(this.env+","+this.region+","+this.Id); }

     public String   getEmptyJson()         { return json(""); }
     public String   getInstanceStr()       { return this.env+","+this.region+","+this.Id+","+this.name+","+this.purpose; }
     public String   getIdentity()          { return getInstanceStr(); }
     public String   getInstanceStrJson()   { return json(this.env+","+this.region+","+this.Id+","+this.name+","+this.purpose); }
     public String   getIdentityJson()      { return getInstanceStrJson(); }
     
     public String   getId()                { return this.Id; }
     public String   getIdJson()            { return json(this.Id); }
     public String   getIdCleanJson()       { return json(this.Id.replace("i-","")); }
     public String   getIdClean()           { return this.Id.replace("i-",""); }
     public String   getIdRawJson()         { return json(this.Id); }
     public String   getIdRaw()             { return this.Id; }
     public String   setId(String sz)       { return this.Id=sz;}

     public String   getResourceTupleJson()     { return json(this.env +  "," + this.region + "," + this.Id); }

     public String   getAZ()               { return this.AZ; }
     public String   getAZJson()           { return json(this.AZ); }
     public String   getEnv()               { return this.env; }
     public String   getEnvJson()           { return json(this.env); }
     public String   setEnv(String sz)      { return this.env=sz; }
     public String   getMappedEnv()          { return this.mappedenv; }
     public String   getMappedEnvJson()      { return json(this.mappedenv); }
     public String   setMappedEnv(String sz) { return this.mappedenv=sz; }

     public String   getEnvReg()            { return this.envreg; }
     public String   getEnvRegJson()        { return json(this.envreg); }
     public String   setEnvReg(String sz)   { return this.envreg=sz; }

     public String   getName()              { return this.name; }
     public String   getNameJson()          { return json(this.name); }
     public String   setName(String sz)     { return this.name=sz; }

     public String   getPurpose()           { return this.purpose; }
     public String   getPurposeJson()       { return json(this.purpose); }
     public String   setPurpose(String sz)  { return this.purpose=sz; }

     public String   getTag()             { return this.tag; }
     public String   getTagJson()         { return json(this.tag); }
     public String   setTag(String sz)    { return this.tag=sz; }

     public String   getOwner()                  { return this.owner.toLowerCase(); }
     public String   getOwnerJson()              { return json(this.owner.toLowerCase()); }
     public String   getOwnerFullCleanJson()     { 
          String sz = this.owner.toLowerCase(); 
          String szSpace       = " ";
          String szComma       = ",";
          sz = sz.replaceAll(Custom.getOwnerFilterString(),"");
          sz = sz.replaceAll("[ ],", szComma);
          sz = sz.replaceAll(",[ ]", szComma);
          sz = sz.replaceAll(szComma, szSpace);
          return json(sz); 
     }
     public String   getOwnerCleanJson()         { 
          String sz = this.owner.toLowerCase(); 
          String szSpace       = " ";
          String szComma       = ",";
          sz = sz.replaceAll(Custom.getOwnerFilterString(),"");
          sz = sz.replaceAll("[ ],", szComma);
          sz = sz.replaceAll(",[ ]", szComma);
          sz = sz.replaceAll(szComma, szSpace);
          sz = sz.replaceAll("[AaEeIiOoUuYy]","");
          return json(sz); 
     }
     public String   setOwner(String sz)         { return this.owner=sz; }
     public String   getOwnerFiltered()          { return this.ownerfiltered; }
     public String   getOwnerFilteredJson()      { return json(this.ownerfiltered); }
     public String   setOwnerFiltered(String sz) { return this.ownerfiltered=sz; }

     public String   getRegion()            { return this.region; }
     public String   getReg()            { return this.region; }
     public String   getRegJson()        { return json(this.region); }
     public String   getRegionJson()        { return json(this.region); }
     public String   setRegion(String sz)   { return this.region=sz; }
     
     public String   getSecurityGroupName()      { return this.securityGroupName; }
     public String   getSecurityGroupNameJson()  { return json(this.securityGroupName); }
     public String   getSecurityGroupByModeJson(int mode)  { 
          String szRet = "";
          switch (mode) {
              case (0): szRet=getSgJson(); break;
              case (1): szRet=getSecurityGroupNameJson(); break;
          }
          return szRet;
     }
     public String   getSecurityGroupByMode(int mode)  { 
          String szRet = "";
          switch (mode) {
              case (0): szRet=getSg(); break;
              case (1): szRet=getSecurityGroupName(); break;
          }
          return szRet;
     }

     public int      getVolumeSize()        { return this.volumesize; }
     public String   getVolumeSizeJson()    { return json(Integer.toString(this.volumesize)); }

     public String   getSg()                { return this.sg.replace("sg-",""); }
     public String   getSgJson()            { return json(this.sg.replace("sg-","")); }
     public String   setSg(String sz)       { return this.sg=sz; }
     
     public String   getSubnetId()          { return this.subnet.replace("subnet-",""); }
     public String   getSubnetIdJson()      { return json(this.subnet.replace("subnet-","")); }
     public String   setSubnetId(String sz) { return this.subnet=sz; }
     
     public String   getStatus()            { return this.status; }
     public String   getStatusJson()        { return json(this.status); }
     public String   setStatus(String sz)   { return this.status=sz; }

     public String   getUnitCostStorageSummary() { return listToString(this.unitCostStorageList," "); }
     public String   getUnitCostStorageSummaryJson() { return json(listToString(this.unitCostStorageList," ")); }

     public String   getUnitStorageSummary() { return listToString(this.unitStorageList," "); }
     public String   getUnitStorageSummaryJson() { return json(listToString(this.unitStorageList," ")); }

     public String   getImageId()          { return this.ami.replace("ami-",""); }
     public String   getImageIdJson()      { return json(this.ami.replace("ami-","")); }
     public String   setImageId(String sz) { return this.ami=sz; }
     public String   getAmi()              { return this.ami.replace("ami-",""); }
     public String   getAmiJson()          { return json(this.ami.replace("ami-","")); }
     public String   setAmi(String sz)     { return this.ami=sz; }

     public Instance getInstance()            { return this.instance; }
     public Instance setInstance(Instance i)  { return this.instance=i; }
     public int      getStateCode()           { return this.stateCode; }
     public int      setStateCode(int n)      { return this.stateCode=n; }

     public double   getStorageCost()         { return this.storageCost; }
     public String   getStorageCostString()   { 
         DecimalFormat df = new DecimalFormat("#0");
         return(df.format(this.storageCost).toString());
     }

     public double   getAllCost()             { return this.storageCost + this.price30DayMonthDouble; }
     public String   getAllCostString()   { 
         DecimalFormat df = new DecimalFormat("#0");
         return(df.format(getAllCost()).toString());
     }
     public int      getStorage()             { return this.storage; }
     public int      setStorage(int n)        { return this.storage=n; }
     public String   getCpuMetricUrl()        { return this.cpuMetricUrl; }
     public String   getNetinMetricUrl()      { return this.netinMetricUrl; }
     public String   getNetoutMetricUrl()     { return this.netoutMetricUrl; }
     public List<String> getVolumeList()         { return this.volumeList; }
     public List<String> getDeviceList()         { return this.deviceList; }
     public List<String> getDeviceIdList()    { return this.deviceIdList; }
     public List<String> getDeviceStatusList()    { return this.deviceStatusList; }
     public List<String> getDeviceSummaryList()   { return this.deviceSummaryList; }
     public String getDeviceSummaryString() { 
         String ddlm = "";
         String sz = "";
         sz = this.volumes;
if ( 1 == getVolumeDataFlag() ) {
         for (String l:this.deviceSummaryList) {
              String[] p = l.split(" ");
              String v1 = "\\\"" + this.getEnv() + "\\\"";
              String v2="\\\"" + p[1] + "\\\"";
              String volid = p[1].replaceAll("vol-","");
              // this.volumes=listToString(this.volumeList," ").replaceAll("vol-","");
              String anchor="<a target='_blank' href='#' onclick='javascript:vNodePerf(" +v1+ "," +v2+ "); return false;'>" + volid + "</a>";
              sz = sz + ddlm + anchor;
              ddlm=" ";
         }
}
     return sz;
     }

public static String getMEMCountString(String instancetype) {
     String string = Cache.getInstanceConfig(instancetype);
     if (string.equals("")) string = "0,0,0,0";
     String[] parts = string.split(",");
     return(parts[1]);
}
public static int getMEMCountInteger(String instancetype) {
     int i = Integer.parseInt( getMEMCountString(instancetype) ); 
     return(i);
}
public static int getCPUCountInteger(String instancetype) {
     int i = Integer.parseInt( getCPUCountString(instancetype) ); 
     return(i);
}
public static String getCPUCountString(String instancetype) {
     String string = Cache.getInstanceConfig(instancetype);
     if (string.equals("")) string = "0,0,0,0";
     String[] parts = string.split(",");
     return(parts[0]);
}
public static int  setVolumeDataFlag(int n) {
     InstanceX.volumeDataFlag = n;
     return(InstanceX.volumeDataFlag);
}
public static int  getVolumeDataFlag() {
     return(InstanceX.volumeDataFlag);
}
private static String concat2(String sz1, String sz2) {
     StringBuilder sb = new StringBuilder();
     return( sb.append(sz1).append(sz2).toString() );
}
private static String concatr3(String sz1, String sz2, String sz3) {
     StringBuilder sb = new StringBuilder();
     return( sb.append(sz1).append(sz2).append(sz3).toString() );
}
private static String concatr4(String sz1, String sz2, String sz3, String sz4) {
     StringBuilder sb = new StringBuilder();
     return( sb.append(sz1).append(sz2).append(sz3).append(sz4).toString() );
}

private static String listToString(List<String> thelist, String delim) {
     String ddlm = "";
     StringBuilder sb = new StringBuilder();
     for (String l:thelist)  {
          sb.append(ddlm).append(l);
          ddlm = delim;
     }
     return( sb.toString() );
}

private static String nonull(String sz,String pre,String post,String nix) {
     return ( ( sz  == null ) ? nix : (pre+sz+post)  );
}
private static String nonull(String sz) {
     return ( ( sz  == null ) ? "-" : sz );
}
public static String json(String sz1) { 
     StringBuilder sb = new StringBuilder();
     String szDQV =         "\"v\"";
     return (sb.append("{").append(szDQV).append(":\"").append(sz1).append("\"}").toString());
}
public static String json(int n) { 
     StringBuilder sb = new StringBuilder();
     String szDQV =         "\"v\"";
     return (sb.append("{").append(szDQV).append(":\"").append(Integer.toString(n)).append("\"}").toString());
}
     private static String getServiceUrl(String env, String op,String node,String reg,int period,int hours) {
          StringBuilder sb = new StringBuilder();
          sb.append("p1?env=").append(env)
                           .append("&op=").append(op)
                           .append("&node=").append(node)
                           .append("&loc=").append(reg)
                           .append("&period=").append(Integer.toString(period))
                           .append("&hours=").append(Integer.toString(hours));
          return(sb.toString());
     }

     private int startInstance(String env, String Region, String instanceId) throws AmazonServiceException, AmazonClientException, InterruptedException {
          DLCConnect conn = new DLCConnect();
          StartInstancesRequest startRequest = new StartInstancesRequest().withInstanceIds(instanceId);
          StartInstancesResult startResult = conn.ConnectEC2(env,region).startInstances(startRequest);
          return 0;
     }

     public static Instance getInstanceById(DLCConnect cn, String env, String reg, String Id) {
          Instance instance = null;

          List <String> list = new ArrayList<String>();
          list.add(Id);
          DescribeInstancesRequest req = new DescribeInstancesRequest();
 	  req.setInstanceIds(list);

          List <Reservation> res =  cn.ConnectEC2(env,reg).describeInstances(req).getReservations();
          for (Reservation r:res) {
               List <Instance> inst = r.getInstances();
               for (Instance i:inst) {
                    instance = i;
                    break;
               }
          }
          return (instance);
     }
     public static List<InstanceX> instanceXInstanceStorageList(DLCConnect cn, String env,String region,List <Reservation> res) {
          List <InstanceX> list = new ArrayList<InstanceX>();
          for (Reservation r:res) {
               List <Instance> inst = r.getInstances();
               for (Instance i:inst) {
                    InstanceX ie = new InstanceX(cn,env,region,i,"storage");
                    list.add(ie);
               }
          }
          return (list);
     }
     public static List<InstanceX> instanceXList(DLCConnect cn, String env,String region,List <Reservation> res) {

          List <InstanceX> list = new ArrayList<InstanceX>();
          // This Loop takes real time to complete
          for (Reservation r:res) {
               List <Instance> inst = r.getInstances();
               for (Instance i:inst) {
                    InstanceX ie = new InstanceX(cn,env,region,i);
                    list.add(ie);
               }
          }

                        Collections.sort(list, new Comparator<InstanceX>() {
                                   @Override
                                   public int compare(InstanceX i1, InstanceX i2) {
                                   return i1.getName().toLowerCase().compareTo(i2.getName().toLowerCase());
                                   }
                        });





          return (list);
     }
     public static String mapInstanceState(String sz) {
          String szRet = "U";
          switch (sz) {
              case ("pending"):            szRet="P"; break;
              case ("running"):            szRet="R"; break;
              case ("shuttingdown"):       szRet="D"; break;
              case ("shutting-down"):      szRet="D"; break;
              case ("stopped"):            szRet="S"; break;
              case ("stopping"):           szRet="G"; break;
              case ("terminated"):         szRet="T"; break;
          }
          return szRet;
     }

public static String getSecurityGroupRules(DLCConnect cn,String env, String region, String id) {
    if ( 1 == 0) {
    DescribeSecurityGroupsRequest req = new DescribeSecurityGroupsRequest();
    req.setGroupIds(Arrays.asList(id));
    DescribeSecurityGroupsResult securityDescription = cn.ConnectEC2(env, region).describeSecurityGroups(req);
    return securityDescription.getSecurityGroups().get(0).toString();
    }
    return("DLCTBD"); 
}

}
