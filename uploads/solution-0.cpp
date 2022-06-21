/**
 *    author:  Rahkin
 *    created: 19/06/2022 04:50:41
**/

#include "bits/stdc++.h"
using namespace std;
/*------------------------------------------------------------*/
#ifdef RAHKIN
#include "debug.h"
#else
#define debug(...) 42
#endif
/*------------------------------------------------------------*/
#define int               long long
#define nl                "\n"
#define pb                push_back
#define pf                push_front
#define all(x)            (x).begin(),(x).end()
#define rall(x)           (x).rbegin(),(x).rend()
#define uniq(v)           (v).erase(unique(all(v)),(v).end())
#define fr                first
#define sc                second
#define mem1(a)           memset(a,-1,sizeof(a))
#define mem0(a)           memset(a,0,sizeof(a))
#define fix(prec)         {cout << setprecision(prec) << fixed;}
#define lcm(a, b)         (((a) * (b)) / __gcd(a, b))
#define yes               cout<<"YES\n"
#define no                cout<<"NO\n"
#define read(A)           for (auto &I: (A)) cin>>I;
#define show(A)           for (auto I: (A)) cout << I << " "; cout << '\n';
#define show1(A)          for (auto I: (A)) cout << I; cout << '\n';
#define tc(Test)          cout<<"Case #"<<Test<<": ";
#define sz(x)             (int)((x).size())
#define ios               {ios_base::sync_with_stdio(false);cin.tie(nullptr);}

const int mod = 1e9 + 7;
const int mod2 = 998244353;
const int inf = 1e18;
const int imax = 1e18;
const int imin = -1e18;
/*------------------------------------------------------------*/

const int N = 2e5 + 5;

signed main()
{
    ios
    
    int T = 1;
    cin >> T;
    for (int test = 1; test <= T; test++)
    {
        int n, m;
        cin >> n >> m;
        int a[n][m];
        for (int i = 0; i < n; i++)
        {
            read(a[i]);
        }
        if ((n + m) % 2 == 0)
        {
            no;
            continue;
        }
        int dp[n][m][2];
        dp[0][0][0] = dp[0][0][1] = a[0][0];
        for (int i = 1; i < m; i++)
        {
            dp[0][i][0] = dp[0][i][1] = a[0][i] + dp[0][i - 1][0];
        }
        for (int i = 1; i < n; i++)
        {
            dp[i][0][1] = dp[i][0][0] = a[i][0] + dp[i - 1][0][1];
        }
        for (int i = 1; i < n; i++)
        {
            for (int j = 1; j < m; j++)
            {
                dp[i][j][0] = a[i][j] + min(dp[i][j - 1][0], dp[i - 1][j][0]);
                dp[i][j][1] = a[i][j] + max(dp[i - 1][j][1], dp[i][j - 1][1]);
            }
        }
        if (dp[n - 1][m - 1][0] % 2 == 1)
        {
            no;
            continue;
        }
        if (dp[n - 1][m - 1][0] <= 0 && dp[n - 1][m - 1][1] >= 0)
            yes;
        else
            no;
    }
    
    return 0;
    
}