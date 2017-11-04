import java.util.Random;
import java.util.Map;
import java.util.HashMap;

public class Helper {
     Helper() {
          super();
     }
     public static String dx(String sz) { return sz; }
     public static String dx(int n) { return Integer.toString(n);  }
     public static String randomDollar( int len ) {
          String LL = "01";
          String AB = "0123";
          Random rnd = new Random();
          StringBuilder sb = new StringBuilder();
          sb.append( LL.charAt( rnd.nextInt(LL.length()) ) );
          sb.append( "." );
          sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
          sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
          return sb.toString();
     }
     public static String randomNumericString( int len ) {
          String AB = "123456789";
          Random rnd = new Random();
          StringBuilder sb = new StringBuilder( len );
          for( int i = 0; i < len; i++ )
               sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
          return sb.toString();
     }
     public static String randomNameString( int len )
     {
        String alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder( len );
        sb.append( alpha.charAt( rnd.nextInt(alpha.length()) ) );

        for( int i = 0; i < (len-1); i++ )
             sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
        return sb.toString();
     }
     public static String randomString( int len ) {
        String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder( len );
        for( int i = 0; i < len; i++ )
             sb.append( AB.charAt( rnd.nextInt(AB.length()) ) );
        return sb.toString();
     }   

    public static String getKeyMap(Map<String,String> m, String hashKey, String def ) {
       if (m.get(hashKey) == null) {
           return def;
       } else {
           return m.get(hashKey).toString();
       }
    }
    public static int getKeyMap(Map<String,Integer> m, String hashKey, int def ) {
       if (m.get(hashKey) == null) {
           return def;
       } else {
           return m.get(hashKey);
       }
    }
    public static Integer getKeyMap(Map<String,Integer> m, String hashKey, Integer def ) {
       if (m.get(hashKey) == null) {
           return def;
       } else {
           return m.get(hashKey);
       }
    }

}

