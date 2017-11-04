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
import java.text.DecimalFormat;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.ec2.model.InstanceBlockDeviceMapping;
import com.amazonaws.services.ec2.model.EbsInstanceBlockDevice;
import com.amazonaws.services.ec2.model.SecurityGroup;
import com.amazonaws.services.ec2.model.IpPermission;
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
import com.amazonaws.services.ec2.model.Placement;
import com.amazonaws.services.ec2.model.GroupIdentifier;
import com.amazonaws.services.ec2.model.DescribeVolumesRequest;
import com.amazonaws.services.ec2.AmazonEC2Client;
import com.amazonaws.regions.Regions;   // Enum
import com.amazonaws.regions.Region;    // Class with the methods
import org.joda.time.*;
import com.amazonaws.services.redshift.AmazonRedshiftClient;
import com.amazonaws.services.redshift.model.DescribeClustersResult;
import com.amazonaws.services.redshift.model.Cluster;

public class Cache {
     private final DLCUtil dlcutil = new DLCUtil(true);
     private static Map<String, String>  sizeStringMap;
     private static Map<String, Integer> sizeIntegerMap;
     private static Map<String, String>  instanceConfigMap;
     private static Map<String, String>  instanceBDMMap;
     private static Map<String, String>  instanceIPOptionMap;
     private static Map<String, String>  instanceOwnerOptionMap;
     private static Map<String, Double>  instancePriceMap;
     private static Map<String, String>  securitygroupMap;
     private static Map<String, String>  securitygroupnameMap;
     private static String NO_OPTION = "<option>-</option>";

     public Cache() {
     }

     public static void instanceConfigMapInit() {
              instanceConfigMap = new HashMap<String, String>(100);
              instanceConfigMap.put("t1.micro","1,0.6,0,L,N");
              instanceConfigMap.put("t2.nano","1,0.5,0,L,N");
              instanceConfigMap.put("t2.micro","1,1,0,L,N");
              instanceConfigMap.put("t2.small","1,2,0,L,N");
              instanceConfigMap.put("t2.medium","2,4,0,L,N");
              instanceConfigMap.put("t2.large","2,8,0,L,N");
              instanceConfigMap.put("m3.medium","1,3.7,1x4,M,N");
              instanceConfigMap.put("m3.large","2,7.2,1x32,M,N");
              instanceConfigMap.put("m3.xlarge","4,15.0,2x80,H,Y");
              instanceConfigMap.put("m3.2xlarge","8,30.0,2x80,H,Y");
              instanceConfigMap.put("m4.large","2,8,0,M,Y");
              instanceConfigMap.put("m4.xlarge","4,16,0,H,Y");
              instanceConfigMap.put("m4.2xlarge","8,32,0,H,Y");
              instanceConfigMap.put("m4.4xlarge","16,64,0,H,Y");
              instanceConfigMap.put("i2.8xlarge","32,244.0,8x800,VH,Y");
              instanceConfigMap.put("r3.large","2,15.2,1x32,M,N");
              instanceConfigMap.put("r3.xlarge","4,30.5,1x80,H,Y");
              instanceConfigMap.put("r3.2xlarge","8,61,1x160,H,Y");
              instanceConfigMap.put("r3.4xlarge","16,122,1x320,H,Y");
              instanceConfigMap.put("r3.8xlarge","32,244,1x800,VH,N");
              instanceConfigMap.put("c3.large","2,3.7,2x16,M,N");
              instanceConfigMap.put("c3.xlarge","4,7.5,2x40,M,Y");
              instanceConfigMap.put("c3.2xlarge","8,15,2x80,H,Y");
              instanceConfigMap.put("c3.4xlarge","16,30,2x160,H,Y");
              instanceConfigMap.put("c3.8xlarge","32,60,2x320,VH,N");
              instanceConfigMap.put("c4.large","2,3.7,2x16,M,N");
              instanceConfigMap.put("c4.xlarge","4,7.5,2x40,M,Y");
              instanceConfigMap.put("c4.2xlarge","8,15,2x80,H,Y");
              instanceConfigMap.put("c4.4xlarge","16,30,2x160,H,Y");
              instanceConfigMap.put("c4.8xlarge","36,60,2x320,VH,Y");
     }
     private static String padder(String sz) { 
          String sb = ""; 
          int m = 24; 
          int n = sz.trim().length(); 
          if ( n > m) n = m; 
          sb = sz.trim(); 
          for (int i=n;i<m;i++) sb = sb + " "; 
          return(sb); 
     }
     public static String getInstanceConfig(String id) {
          return(Helper.getKeyMap(Cache.instanceConfigMap,id,"0,0,0,0,0"));
     }
         //this.name    = Helper.getKeyMap(tagmap,"Name","-");
         //this.purpose = Helper.getKeyMap(tagmap,"Purpose","-");
         //this.tag     = Helper.getKeyMap(tagmap,Custom.getTagNameString(),"-");
         //this.ownerfiltered = this.owner.replaceAll("[AaEeIiOoUuYy]","");
     private  static String nonull(String sz) {
          return ( ( sz  == null ) ? "-" : sz );
     }

     public static void InstanceOwnerOptionMapInit(DLCConnect dc,String acct, String region ) {
          StringBuilder sb = new StringBuilder();
          Cache.instanceOwnerOptionMap = new HashMap<String, String>(16);
          AmazonEC2Client conn = dc.Connect(acct,region);
          for (Reservation res: conn.describeInstances().getReservations()) {
               for (Instance inst: res.getInstances() ) {
                    Map<String, String>     tagmap  = new HashMap<String, String>(64);
                    for (Tag teg:inst.getTags()) tagmap.put(teg.getKey(), teg.getValue());
                    sb.setLength(0);
                    //String sz = Helper.getKeyMap(tagmap,"Owner","-").replaceAll("[AaEeIiOoUuYy]","").replaceAll( Custom.getOwnerFilterString(), "");
                    String sz = Helper.getKeyMap(tagmap,"Owner","-").replaceAll("@dtcc[.]com","");
                    sb.append("<option>").append(nonull(sz)).append("</option>");
                    sb.append("<option>").append(nonull(inst.getKeyName())).append("</option>");
                    instanceOwnerOptionMap.put(inst.getInstanceId(), sb.toString() );
              }
          }
     }
     public static String getInstanceOwnerOptionMap(String id) {
          return(Helper.getKeyMap(Cache.instanceOwnerOptionMap,id,NO_OPTION));
     }
     public static void InstanceIPOptionMapInit(DLCConnect dc,String acct, String region ) {
          StringBuilder sb = new StringBuilder();
          Cache.instanceIPOptionMap = new HashMap<String, String>(16);
          AmazonEC2Client conn = dc.Connect(acct,region);
          for (Reservation res: conn.describeInstances().getReservations()) {
               for (Instance inst: res.getInstances() ) {
                    sb.setLength(0);
                    sb.append("<option>").append(nonull(inst.getVpcId())).append("</option>");
                    sb.append("<option>").append(nonull(inst.getPrivateIpAddress())).append("</option>");
                    sb.append("<option>").append(nonull(inst.getPublicIpAddress())).append("</option>");
                    sb.append("<option>").append(nonull(inst.getSubnetId())).append("</option>");
                    instanceIPOptionMap.put(inst.getInstanceId(), sb.toString() );
              }
          }
     }
     public static String getInstanceIPOptionMap(String id) {
          return(Helper.getKeyMap(Cache.instanceIPOptionMap,id,"-"));
     }
     public static void InstanceBDMOptionMapInit(DLCConnect dc,String acct, String region ) {
          String sz = "";
          int n=0;
          Cache.instanceBDMMap = new HashMap<String, String>(400);
          AmazonEC2Client conn = dc.Connect(acct,region);
          for (Reservation res: conn.describeInstances().getReservations()) {
               for (Instance inst: res.getInstances() ) {
                    sz = "";
                    for (InstanceBlockDeviceMapping bdm:inst.getBlockDeviceMappings()) {
                         String vid =  bdm.getEbs().getVolumeId();
                         String szSize = getSizeString( vid );
                         sz = sz +"<option>" + bdm.getDeviceName() + ", " + vid + ", " + szSize + "</option>";
                         n = (sz.length() > n) ? sz.length() : n;
                    }
                    //sz = sz + "</select>";
                    instanceBDMMap.put(inst.getInstanceId(), sz);
              }
          }

         // SIFL
         // for(Map.Entry<String, String> entry : instanceBDMMap.entrySet()) {
         //      String key = entry.getKey();
         //      String value = entry.getValue();
         //     String newvalue = u.padder(value,n+3);
         //     instanceBDMMap.put(key, newvalue);
         //}
}


     public static String getInstanceBDMOptionMap(String id) {
          return(Helper.getKeyMap(Cache.instanceBDMMap,id,"-"));
     }

     public static void VolumeMapInit(DLCConnect dc,String acct, String region ) {
          AmazonEC2Client conn = dc.Connect(acct,region);
          List<Volume> list = conn.describeVolumes().getVolumes();
          Cache.sizeStringMap = new HashMap<String, String>(400);
          Cache.sizeIntegerMap = new HashMap<String, Integer>(400);

          for (Volume v:list) {
              sizeStringMap.put(v.getVolumeId(), v.getSize().toString());
              sizeIntegerMap.put(v.getVolumeId(), v.getSize());
          }
     }
     public static String getSize(String id) {
          return(Helper.getKeyMap(Cache.sizeStringMap,id,"-"));
     }
     public static String getSizeString(String id) {
          return(getSize(id));
     }
     public static Integer getSizeInteger(String id) {
          return( Helper.getKeyMap(Cache.sizeIntegerMap,id,0) );
     }
     public static Double getSizeDouble(String id) {
          return( getSizeInteger(id).doubleValue() );
     }
     public static Double getCostDouble(String id) {
          return( getSizeInteger(id).doubleValue() * 0.125 );
     }


     public static void instancePriceMapInit() {
          instancePriceMap = new HashMap<String, Double>(100);
          instancePriceMap.put("t1.micro",0.080);
          instancePriceMap.put("t2.micro",0.073);
          instancePriceMap.put("t2.small",0.086);
          instancePriceMap.put("t2.medium",0.112);
          instancePriceMap.put("t2.large",0.164);

          instancePriceMap.put("m4.large",0.186);
          instancePriceMap.put("m4.xlarge",0.312);
          instancePriceMap.put("m4.2xlarge",0.634);
          instancePriceMap.put("m4.4xlarge",1.138);
          instancePriceMap.put("m4.10xlarge",2.265);

          instancePriceMap.put("m3.medium",0.130);
          instancePriceMap.put("m3.large",0.200);
          instancePriceMap.put("m3.xlarge",0.340);
          instancePriceMap.put("m3.2xlarge",0.690);
          instancePriceMap.put("c3.large",0.105);
          instancePriceMap.put("c3.xlarge",0.210);
          instancePriceMap.put("c3.2xlarge",0.420);
          instancePriceMap.put("c3.4xlarge",0.840);
          instancePriceMap.put("c3.8xlarge",1.680);
          instancePriceMap.put("c4.large",0.176);
          instancePriceMap.put("c4.xlarge",0.292);
          instancePriceMap.put("c4.2xlarge",0.594);
          instancePriceMap.put("c4.4xlarge",1.058);
          instancePriceMap.put("c4.8xlarge",1.986);
          instancePriceMap.put("r3.large",0.235);
          instancePriceMap.put("r3.xlarge",0.430);
          instancePriceMap.put("r3.2xlarge",0.880);
          instancePriceMap.put("r3.4xlarge",1.630);
          instancePriceMap.put("r3.8xlarge",2.930);
          instancePriceMap.put("i2.8xlarge",6.950);
     }
     public static Double getPrice30DayMonthDouble(String type) {
          return (  (instancePriceMap.get(type) == null) ? 0.0 : instancePriceMap.get(type)*24.0*30.0);
     }
     public static String getPrice30DayMonth(String type) {
          DecimalFormat df = new DecimalFormat("#0");
          return (  (instancePriceMap.get(type) == null) ? 
                    df.format(0).toString() : df.format(instancePriceMap.get(type)*24.0*30).toString());
     }
     public static String getPrice5DayWeek(String type) {
          DecimalFormat df = new DecimalFormat("#0.00");
          return (  (instancePriceMap.get(type) == null) ? 
                    df.format(0).toString() : df.format(instancePriceMap.get(type)*24.0*5).toString());
     }
     public static String getPrice7DayWeek(String type) {
          DecimalFormat df = new DecimalFormat("#0.00");
          return (  (instancePriceMap.get(type) == null) ? 
                    df.format(0).toString() : df.format(instancePriceMap.get(type)*24.0*7).toString());
     }
     public static String getPrice24(String type) {
          DecimalFormat df = new DecimalFormat("#0");
          String str = (instancePriceMap.get(type) == null) ? 
                       df.format(0).toString() : df.format(instancePriceMap.get(type)*24.0).toString();
          return (str);
     }
     public static String getPrice(String type) {
          DecimalFormat df = new DecimalFormat("#0.00");
          return (  (instancePriceMap.get(type) == null) ? df.format(0).toString() : 
                    df.format(instancePriceMap.get(type)).toString());
     }


     public static void securitygroupMapInit(DLCConnect cn,String acct, String region ) {
          String sz = "";
          int n=0;
          int ct = 0;
          Cache.securitygroupMap = new HashMap<String, String>(400);
          Cache.securitygroupnameMap = new HashMap<String, String>(400);
          for (SecurityGroup i: cn.Connect(acct,region).describeSecurityGroups().getSecurityGroups()) {
               String PERMS="";
               String pp = "";
               pp=pp + "<option>" + i.getGroupName()+"</option>";
               pp=pp + "<option>" + i.getGroupId()+"</option>";
               List<IpPermission> iplist = i.getIpPermissions();
               for (IpPermission j:iplist) {
                        String protocol = j.getIpProtocol();
                        Integer fromPort;
                        Integer toPort;
                        String szFromPort = "";
                        String szToPort = "";
	                try {
                             szFromPort = (j.getFromPort() == -1) ? "allICMP" : j.getFromPort().toString();
                             szToPort   = (j.getToPort()   == -1) ? "allICMP" : j.getToPort().toString();
	                } catch (Exception e) {
                             szFromPort = "X";
                             szToPort   = "X";
	                } finally {
                        }
                        switch (protocol) {
                             case ("udp"):
                             case ("tcp"):
                             case ("icmp"):
                                  break;
                             default:
                                  protocol = "PROTOCOL["+protocol+"]"; 
                                  break;
                        }
                       
                        int k = 1;
                        // pp = pp + "\n"+dlcutil.padder(protocol+":"+szFromPort+":"+szToPort);
                        List<String> ipRanges = j.getIpRanges();
                        Collections.sort(ipRanges, new Comparator<String>() {
	                           @Override
	                           public int compare(String i1, String i2) {
                                   return i1.compareTo(i2);
	                           }
	                });
                        // pp=pp+u.padder("NO RANGES");
                        if ( ipRanges.size() == 0) 
                             pp=pp+"<option>"+padder(protocol+":"+szFromPort+":"+szToPort) + padder("NO RANGES")+"</option>";
                        for (String s:ipRanges) {
                             // if (((k++) % 3== 0)) pp=pp+"\n";
                             pp=pp+"<option>"+padder(protocol+":"+szFromPort+":"+szToPort) + padder(s)+"</option>";
                        }
               }

               securitygroupMap.put(i.getGroupId(), pp);
               securitygroupnameMap.put(i.getGroupId(), i.getGroupName());
     }
}
     public static String getSecurityGroupOptionMap(String id) {
          return(Helper.getKeyMap(Cache.securitygroupMap,id,"-"));
     }
     public static String getSecurityGroup(String id) {
          return(Helper.getKeyMap(Cache.securitygroupMap,id,"-"));
     }
     public static String getSecurityGroupName(String id) {
          return(Helper.getKeyMap(Cache.securitygroupnameMap,id,"-"));
     }

}




